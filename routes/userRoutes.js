const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { uuidValidation } = require("../common/middleware/validation");

// [GET] Get a user by UUID
router.get("/get/:uuid", uuidValidation, userController.getUserByUuid);

// [POST] Create a new user
router.post("/onboard", userController.createUser);

// [PATCH] Update a user by UUID
router.patch("/update/:uuid", uuidValidation, userController.updateUserByUuid);

// [DELETE] Delete a user by UUID
router.delete("/delete/:uuid", uuidValidation, userController.deleteUserByUuid);

module.exports = router;
