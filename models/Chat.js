const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  participantUUIDs: {
    buyerUUID: {
      type: String,
      required: true,
    },
    sellerUUID: {
      type: String,
      required: true,
    },
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
});

// Ensure there are no duplicate chats with the same participants and listing
chatSchema.index({ participantUUIDs: 1, listingId: 1 }, { unique: true });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
