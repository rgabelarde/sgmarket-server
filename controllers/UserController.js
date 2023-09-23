const User = require("../models/User");
const { NotFoundError, Error4xx } = require("../common/utils/errorValues");
const { handleError } = require("../common/utils/errorHandler");

// [GET] Get a user by user_id (mongoId)
exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    if (!userId) {
      throw new Error4xx("userId parameter is missing in the URL");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
};
// [GET] Get a user by UUID
exports.getUserByUuid = async (req, res) => {
  const uuid = req.params.uuid;

  try {
    if (!uuid) {
      throw new Error4xx("UUID parameter is missing from the URL");
    }
    const user = await User.findOne({ uuid });
    if (!user) {
      throw new NotFoundError("Current user not found");
    } else {
      res.json(user);
    }
  } catch (error) {
    handleError(res, error);
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
      throw new Error4xx(
        "User with the same username (case insensitive), email, or uuid already exists"
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
    handleError(res, error);
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
    if (!uuid) {
      throw new Error4xx("UUID parameter is missing from the URL");
    }
    if (Object.keys(updatedFields).length === 0) {
      throw new Error4xx(
        "No parameters provided for update, request body is empty"
      );
    } else {
      const updatedUser = await User.findOneAndUpdate(
        { uuid: uuid },
        updatedFields,
        { new: true } // Return updated document
      );

      if (!updatedUser) {
        throw new NotFoundError("User not found");
      } else {
        res.json(updatedUser);
      }
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a user by their UUID (in URL)
exports.deleteUserByUuid = async (req, res) => {
  const uuid = req.params.uuid;

  try {
    if (!uuid) {
      throw new Error4xx("UUID parameter is missing in the URL");
    }
    const deletedUser = await User.findOneAndDelete({ uuid: uuid });
    if (!deletedUser) {
      throw new NotFoundError("User not found");
    } else {
      res.json({ message: "User deleted successfully" });
    }
  } catch (error) {
    handleError(res, error);
  }
};
