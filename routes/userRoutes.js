const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  uuidValidation,
  mongoIdValidation,
  createUserValidation,
} = require("../common/middleware/validation");

// [GET] Get a user by UUID
router.get("/get/uuid/:uuid", uuidValidation, userController.getUserByUuid);

// [GET] Get a user by UUID
router.get("/get/id/:userId", mongoIdValidation, userController.getUserById);

// [POST] Create a new user
router.post("/onboard", createUserValidation, userController.createUser);

// [PATCH] Update a user by UUID
router.patch("/update/:uuid", uuidValidation, userController.updateUserByUuid);

// [DELETE] Delete a user by UUID
router.delete("/delete/:uuid", uuidValidation, userController.deleteUserByUuid);

module.exports = router;
