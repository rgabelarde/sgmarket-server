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

    const userExists = await User.exists({ uuid: uuid });
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
    const otherUserUuid = listing.seller.uuid;

    // Find the chat that includes both the current user and other user for the specific listing
    const chat = await Chat.findOne({
      $and: [
        { "participantUUIDs.buyerUUID": uuid },
        { "participantUUIDs.sellerUUID": otherUserUuid },
        { listingId: listingId },
      ],
    });

    if (!chat) {
      throw new NotFoundError("Chat not found");
    }
    // Find all messages in the chat
    const messages = await Message.find({ chatId: chat._id });
    res.json(messages);
  } catch (error) {
    handleError(res, error);
  }
};
// Create a new message in a chat regarding a unique listing (if chat is new, create a new chat object as well)
exports.createMessageInChat = async (req, res) => {
  const { chatId, buyerUUID, content } = req.body;
  const listingId = req.params.listingId;

  try {
    let chat;

    if (!listingId) {
      throw new Error4xx("listingId parameter is missing in the URL");
    }

    if (!buyerUUID || !content) {
      throw new Error4xx(
        "buyerUUID and content are required request body fields"
      );
    }

    const userExists = await User.exists({ uuid: buyerUUID });
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
    const sellerUUID = listing.seller.uuid;

    if (sellerUUID === buyerUUID) {
      throw new Error4xx("Seller cannot enquire on their own listing");
    }

    if (!chatId) {
      // Look for an existing chat with the same buyerUUID and listingId
      chat = await Chat.findOne({
        $and: [
          { "participantUUIDs.buyerUUID": buyerUUID },
          { listingId: listingId },
        ],
      });

      if (!chat) {
        // If no existing chat is found, create a new one
        chat = new Chat({
          participantUUIDs: { buyerUUID, sellerUUID },
          listingId,
        });
        chat = await chat.save();
      }
    } else {
      // If chatId is provided, check if the chat exists
      chat = await Chat.findById(chatId);
      if (!chat) {
        throw new NotFoundError("Chat not found");
      }
    }
    // Create a new message associated with the chat
    const newMessage = new Message({
      chatId: chat._id,
      uuid: buyerUUID,
      content,
    });
    // Save the new message
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    handleError(res, error);
  }
};
