const Chat = require("../models/Chat");
const User = require("../models/User");

// Helper function to handle errors
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// Get a chat involving the current user and another user for a specific listing
export const getChatForListing = async (req, res) => {
  const { uuid } = req.query;
  const { listingId } = req.params;

  try {
    const userExists = await User.exists({ uuid: uuid });
    if (!userExists) {
      handleError(res, 404, "Current user not found");
    }
    // Find the chat associated with the specified listing and involving the current user
    const chat = await Chat.findOne({
      participantUuids: uuid, // Check if uuid is one of the participants
      listingId,
    });

    if (!chat) {
      handleError(res, 404, "Chat not found");
    }

    res.json(chat);
  } catch (error) {
    return handleError(res, 500, error.message ?? "Internal Server Error");
  }
};
