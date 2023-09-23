const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  uuid: {
    type: String,
    required: true,
    validate: {
      // Custom validator to check if the uuid exists in the User collection
      validator: async function (value) {
        const User = mongoose.model("User");
        const user = await User.findOne({ uuid: value });
        return !!user;
      },
      message: "Sender with this UUID does not exist.",
    },
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
