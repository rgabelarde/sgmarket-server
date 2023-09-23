const User = require("../models/User");

// Helper function to handle errors
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// [GET] Get a user using their unique UUID
exports.findUserByUuid = async (req, res) => {
  const { uuid } = req.params;

  try {
    const user = await User.findOne({ uuid });
    if (!user) {
      handleError(res, 404, "User not found");
    } else {
      res.json(user);
    }
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// [GET] Get a user by unique userId
exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      handleError(res, 404, "User not found");
    } else {
      res.json(user);
    }
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// [POST] Create a new user
exports.createUser = async (req, res) => {
  const { username, email, biometricVerified, flags, uuid } = req.body;

  try {
    // Check if a user with the same username, email, or uuid already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { uuid }],
    });

    if (existingUser) {
      handleError(
        res,
        409,
        "User with the same username, email, or uuid already exists"
      );
    } else {
      // Create a new user document based on the request body
      const newUser = new User({
        username,
        email,
        biometricVerified,
        flags,
        uuid,
      });

      // Save the new user to the database
      await newUser.save();
      res.status(201).json(newUser);
    }
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// Update a user by their uuid (in URL)
exports.updateUserByUuid = async (req, res) => {
  const uuid = req.params.uuid;
  const updateFields = ["username", "email", "biometricVerified", "flags"];
  const updatedFields = {};

  updateFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updatedFields[field] = req.body[field];
    }
  });

  try {
    if (Object.keys(updatedFields).length === 0) {
      handleError(res, 400, "No fields provided for update");
    } else {
      const updatedUser = await User.findOneAndUpdate(
        { uuid: uuid },
        updatedFields,
        { new: true } // Return updated document
      );

      if (!updatedUser) {
        handleError(res, 404, "User not found");
      } else {
        res.json(updatedUser);
      }
    }
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// Delete a user by their UUID (in URL)
exports.deleteUserByUuid = async (req, res) => {
  const { uuid } = req.body;

  if (!uuid) {
    handleError(res, 400, "UUID parameter is missing in the URL");
  }
  try {
    const deletedUser = await User.findOneAndDelete({ uuid: uuid });
    if (!deletedUser) {
      handleError(res, 404, "User not found");
    } else {
      res.json({ message: "User deleted successfully" });
    }
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};
