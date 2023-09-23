const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");

const {
  listingIdValidation,
  queryUserUUIDValidation,
} = require("./middleware/validation");

// Route to get a chat for a specific listing involving the current user and another user
router.get(
  "/:listingId",
  [...listingIdValidation, ...queryUserUUIDValidation],
  chatController.getChatForListing
);

module.exports = router;
