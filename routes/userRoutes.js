const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { uuidValidation, userIdValidation } = require("./middleware/validation");

// Get a user by UUID
router.get("/get/:uuid", uuidValidation, userController.findUserByUuid);

// Get a user by userId
router.get("/get/:userId", userIdValidation, userController.getUserById);

// Create a new user
router.post("/onboard", userController.createUser);

// Update a user by UUID
router.put("/update/:uuid", uuidValidation, userController.updateUserByUuid);

// Delete a user by UUID
router.delete("/delete/:uuid", uuidValidation, userController.deleteUserByUuid);

module.exports = router;
