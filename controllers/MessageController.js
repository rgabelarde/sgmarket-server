const Message = require("../models/Message");
const Chat = require("../models/Chat");
const Listing = require("../models/Listing");
const User = require("../models/User");

// Helper function to handle errors
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// Get all messages involving the current user and another user for a specific listing
export const getMessagesInChatForListing = async (req, res) => {
  const { listingId } = req.params;
  const { uuid } = req.query;

  try {
    const userExists = await User.exists({ uuid: uuid });
    if (!userExists) {
      handleError(res, 404, "Current user not found");
    }

    // Find the listing to get the seller's UUID
    const listing = await Listing.findById(listingId);
    if (!listing) {
      handleError(res, 404, "Listing not found");
    }
    // Populate the seller's UUID from the listing
    await listing.populate("seller").execPopulate();
    const otherUserUuid = listing.seller.uuid;

    // Find the chat that includes both current user and other user for the specific listing
    const chat = await Chat.findOne({
      participantUuids: { $all: [uuid, otherUserUuid] },
      listingId,
    });

    if (!chat) {
      handleError(res, 404, "Chat not found");
    }
    // Find all messages in the chat
    const messages = await Message.find({ chatId: chat._id });

    res.json(messages);
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// Create a new message in a chat regarding a unique listing (if chat is new, create a new chat object as well)
export const createMessageInChat = async (req, res) => {
  const { chatId, uuid, content } = req.body;
  const { listingId } = req.params;

  try {
    let chat;

    const userExists = await User.exists({ uuid: uuid });
    if (!userExists) {
      handleError(res, 404, "Current user not found");
    }

    if (!chatId) {
      // Create a new chat involving the buyer and seller
      const listing = await Listing.findById(listingId);
      if (!listing) {
        handleError(res, 404, "Listing not found");
      }
      const sellerUuid = listing.seller.uuid;

      chat = new Chat({
        participantUuids: [uuid, sellerUuid],
        listingId,
      });
      chat = await chat.save();
    } else {
      // If chatId is provided, check if the chat exists
      chat = await Chat.findById(chatId);
      if (!chat) {
        handleError(res, 404, "Chat not found");
      }
    }
    // Create a new message associated with the chat
    const newMessage = new Message({
      chatId: chat._id,
      uuid,
      content,
    });
    // Save the new message
    const savedMessage = await newMessage.save();

    res.json(savedMessage);
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};
