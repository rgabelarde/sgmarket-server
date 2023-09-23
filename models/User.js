const mongoose = require("mongoose");
const fs = require("fs");

let vulgarities;

fs.readFile("./data/vulgarities.txt", function (err, data) {
  if (err) throw err;
  vulgarities = data.toString().split("\n");
});

// Create a custom validation function for username
const usernameValidator = (value) => {
  // Regular expression to check for spaces, vulgarities, and symbols at the start
  const spacePattern = /\s/;
  const symbolPattern = /^[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/; // Add symbols you want to disallow
  // add casing insensitivity
  const lowercaseValue = value.toLowerCase();

  // Check for spaces
  if (spacePattern.test(value)) {
    return false;
  }

  // Check for vulgarities
  if (vulgarities.some((vulgar) => lowercaseValue.includes(vulgar))) {
    return false;
  }

  // Check for symbols at the start
  if (symbolPattern.test(lowercaseValue[0])) {
    return false;
  }

  return true;
};

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
    validate: {
      validator: usernameValidator,
      message:
        "Username cannot contain spaces, vulgarities, or start with a symbol.",
    },
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
