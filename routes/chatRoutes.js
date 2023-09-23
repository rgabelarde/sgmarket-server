const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");

const {
  listingIdValidation,
  queryUserUUIDValidation,
  uuidValidation,
} = require("../common/middleware/validation");

// [GET] Get all chats for a specific user's UUID
router.get("/get/all/:uuid", uuidValidation, chatController.getChatsForUser);

// [GET] Get a chat for a specific listing involving the current user and another user
router.get(
  "/:listingId",
  [...listingIdValidation, ...queryUserUUIDValidation],
  chatController.getChatForListing
);

module.exports = router;
