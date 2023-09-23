const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        // Regex to verify UUIDv4 format (e.g. 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
        const uuidV4Pattern =
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidV4Pattern.test(value);
      },
      message: "UUID is not in a valid format (UUIDv4).",
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(value);
      },
      message: "Email is not in a valid format.",
    },
  },
  biometricVerified: {
    type: Boolean,
    default: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  flags: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
