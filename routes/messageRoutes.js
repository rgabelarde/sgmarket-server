const express = require("express");
const router = express.Router();
const messageController = require("../controllers/MessageController");
const {
  getMessagesInChatValidation,
  buyerMessageInChatValidation,
  sellerMessageInChatValidation,
} = require("../common/middleware/validation");

// [GET] Get all messages involving the current user and another user for a specific listing
router.get(
  "/view/:listingId",
  getMessagesInChatValidation,
  messageController.getMessagesInChatForListing
);

// [POST] Create a new message in a chat regarding a unique listing (as buyer)
// (if chat is new, create a new chat object as well)
router.post(
  "/buy/:listingId",
  buyerMessageInChatValidation,
  messageController.messageSeller
);

// [POST] Create a new message in a chat regarding a unique listing (as seller)
// (if chat is new, create a new chat object as well)
router.post(
  "/sell/:listingId",
  sellerMessageInChatValidation,
  messageController.messageBuyer
);

module.exports = router;
