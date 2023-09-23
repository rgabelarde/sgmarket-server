const express = require("express");
const router = express.Router();
const messageController = require("../controllers/MessageController");
const {
  getMessagesInChatValidation,
  createMessageInChatValidation,
} = require("../common/middleware/validation");

// [GET] Get all messages involving the current user and another user for a specific listing
router.get(
  "/:listingId",
  getMessagesInChatValidation,
  messageController.getMessagesInChatForListing
);

// [POST] Create a new message in a chat regarding a unique listing
// (if chat is new, create a new chat object as well)
router.post(
  "/new/:listingId",
  createMessageInChatValidation,
  messageController.createMessageInChat
);

module.exports = router;
