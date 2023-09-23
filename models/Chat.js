const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  participantUuids: [
    {
      type: String,
      required: true,
      validate: {
        // Ensure exactly 2 participants
        validator: function (value) {
          return value.length === 2;
        },
        message: "Exactly 2 participants are required in a chat.",
      },
    },
  ],
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
});

// Ensure there are no duplicate chats with the same participants and listing
chatSchema.index({ participantUuids: 1, listingId: 1 }, { unique: true });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
