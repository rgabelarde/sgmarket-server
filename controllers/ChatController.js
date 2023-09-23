const Chat = require("../models/Chat");
const User = require("../models/User");
const { NotFoundError, Error4xx } = require("../common/utils/errorValues");
const { handleError } = require("../common/utils/errorHandler");

// Get a chat involving the current user and another user for a specific listing
exports.getChatForListing = async (req, res) => {
  const { uuid } = req.query;
  const listingId = req.params.listingId;

  try {
    if (!uuid) {
      throw new Error4xx("UIUD missing from query parameters");
    }
    if (!listingId) {
      throw new Error4xx("listingId parameter is missing in the URL");
    }

    const userExists = await User.exists({ uuid: uuid });
    if (!userExists) {
      throw new NotFoundError("Current user not found");
    }

    // Find the chat associated with the specified listing and involving the current user
    const chat = await Chat.findOne({
      $or: [
        { "participantUUIDs.buyerUUID": uuid },
        { "participantUUIDs.sellerUUID": uuid },
      ],
      listingId,
    });

    if (!chat) {
      throw new NotFoundError("Chat not found");
    }

    res.json(chat);
  } catch (error) {
    handleError(res, error);
  }
};

// Get all chats for a specific user's UUID
exports.getChatsForUser = async (req, res) => {
  const uuid = req.params.uuid;

  try {
    if (!uuid) {
      throw new Error4xx("UUID parameter is missing in the URL");
    }
    const userExists = await User.exists({ uuid: uuid });
    if (!userExists) {
      throw new NotFoundError("Current User not found");
    }

    // Find all chats where the uuid is one of the participants (either buyerUUID or sellerUUID)
    const chats = await Chat.find({
      $or: [
        { "participantUUIDs.buyerUUID": uuid },
        { "participantUUIDs.sellerUUID": uuid },
      ],
    });

    res.json(chats);
  } catch (error) {
    handleError(res, error);
  }
};
