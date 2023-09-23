const Message = require("../models/Message");
const Chat = require("../models/Chat");
const Listing = require("../models/Listing");
const User = require("../models/User");
const { NotFoundError, Error4xx } = require("../common/utils/errorValues");
const { handleError } = require("../common/utils/errorHandler");

// Get all messages involving the current user and another user for a specific listing
exports.getMessagesInChatForListing = async (req, res) => {
  const listingId = req.params.listingId;
  const { uuid } = req.query;

  try {
    if (!uuid) {
      throw new Error4xx("UUID missing from query parameters");
    }
    if (!listingId) {
      throw new Error4xx("listingId parameter is missing in the URL");
    }

    // Check if the user exists
    const userExists = await User.exists({ uuid });
    if (!userExists) {
      throw new NotFoundError("Current user not found");
    }

    // Find the listing to get the seller's UUID
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    // Populate the seller's UUID from the listing
    await listing.populate("seller");
    const listingOwnerUUID = listing.seller.uuid;

    // Find the chat that includes both the current user and other user for the specific listing
    const chat = await Chat.findOne({
      $and: [
        { "participantUUIDs.buyerUUID": uuid },
        { "participantUUIDs.sellerUUID": listingOwnerUUID },
        { listingId },
      ],
    });

    if (!chat) {
      throw new NotFoundError("Chat not found");
    }

    // Find all messages in the chat
    const messages = await Message.find({ linkedChat: chat._id });
    res.json(messages);
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new message in a chat regarding a unique listing (if chat is new, create a new chat object as well)
exports.messageBuyer = async (req, res) => {
  const { chatId, sellerUUID, buyerUUID, content } = req.body;
  const listingId = req.params.listingId;

  try {
    let chat;

    if (!listingId) {
      throw new Error4xx("listingId parameter is missing in the URL");
    }

    if (!content) {
      throw new Error4xx("Content in message is a required request body field");
    }

    if (!chatId && !buyerUUID) {
      throw new Error4xx(
        "UUID (buyer's) OR chatId are required request body fields"
      );
    }

    // Check if the seller exists
    if (sellerUUID) {
      const sellerExists = await User.exists({ uuid: sellerUUID });
      if (!sellerExists) {
        throw new NotFoundError("Specified seller UUID's user is not found");
      }
    }

    // Check if the buyer exists
    if (buyerUUID) {
      const buyerExists = await User.exists({ uuid: buyerUUID });
      if (!buyerExists) {
        throw new NotFoundError("Specified buyer UUID's user is not found");
      }
    }

    // Find the listing to get the seller's UUID
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    // Populate the seller's UUID from the listing
    await listing.populate("seller");
    const listingOwnerUUID = listing.seller.uuid;

    if (buyerUUID && buyerUUID === listingOwnerUUID) {
      throw new Error4xx("Seller cannot enquire about their own listing");
    }

    if (sellerUUID && sellerUUID !== listingOwnerUUID) {
      throw new Error4xx("sellerUUID does not match listing owner's uuid");
    }

    if (chatId) {
      // If chatId is provided, check if the chat exists
      chat = await Chat.findById(chatId);
      if (!chat) {
        throw new NotFoundError("Specified chatId Chat not found");
      }
    } else {
      // No chatId provided, means buyerUUID provided
      // Look for an existing chat with the same sellerUUID, buyerUUID, and listingId
      chat = await Chat.findOne({
        $and: [
          { "participantUUIDs.buyerUUID": buyerUUID },
          { "participantUUIDs.sellerUUID": sellerUUID ?? listingOwnerUUID },
          { listingId },
        ],
      });

      if (!chat) {
        // If no existing chat is found, create a new one
        chat = new Chat({
          participantUUIDs: {
            buyerUUID,
            sellerUUID: sellerUUID ?? listingOwnerUUID,
          },
          listingId,
        });
        chat = await chat.save();
      }
    }
    // Create a new message associated with the chat
    const newMessage = new Message({
      linkedChat: chat._id,
      uuid: sellerUUID ?? listingOwnerUUID,
      content,
    });
    // Save the new message
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new message in a chat regarding a unique listing (if chat is new, create a new chat object as well)
exports.messageSeller = async (req, res) => {
  const { chatId, uuid, content } = req.body;
  const listingId = req.params.listingId;

  try {
    let chat;

    if (!listingId) {
      throw new Error4xx("listingId parameter is missing in the URL");
    }

    if (!uuid || !content) {
      throw new Error4xx(
        "UUID (buyer's) and content are required request body fields"
      );
    }

    // Check if the buyer exists
    const buyerExists = await User.exists({ uuid });
    if (!buyerExists) {
      throw new NotFoundError("Specified buyer UUID's user is not found");
    }

    // Find the listing to get the seller's UUID
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw NotFoundError("Listing not found");
    }

    // Populate the seller's UUID from the listing
    await listing.populate("seller");
    const listingOwnerUUID = listing.seller.uuid;

    if (uuid === listingOwnerUUID) {
      throw new Error4xx("Seller cannot enquire about their own listing");
    }

    if (chatId) {
      // If chatId is provided, check if the chat exists
      chat = await Chat.findById(chatId);
      if (!chat) {
        throw new NotFoundError("Chat not found");
      }
    } else {
      // Look for an existing chat with the same buyerUUID and listingId
      chat = await Chat.findOne({
        $and: [{ "participantUUIDs.buyerUUID": uuid }, { listingId }],
      });

      if (!chat) {
        // If no existing chat is found, create a new one
        chat = new Chat({
          participantUUIDs: { buyerUUID: uuid, sellerUUID: listingOwnerUUID },
          listingId,
        });
        chat = await chat.save();
      }
    }
    // Create a new message associated with the chat
    const newMessage = new Message({
      linkedChat: chat._id,
      uuid,
      content,
    });
    // Save the new message
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    handleError(res, error);
  }
};
