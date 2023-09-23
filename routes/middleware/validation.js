const { body, param, query, check } = require("express-validator");

// Custom validation function
const validate = (validatorFn, errorMessage) => (value) => {
  if (!validatorFn(value)) {
    throw new Error(errorMessage);
  }
  return true;
};

// Validation functions for different types of data
const isMongoId = (value) => /^[0-9a-fA-F]{24}$/.test(value);
const isUUIDv4 = (value) =>
  /^[a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12}$/i.test(value);
const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim() !== "";
const isPositiveInteger = (value) => /^\d+$/.test(value) && parseInt(value) > 0;
const isNonNegativeNumber = (value) =>
  !isNaN(parseFloat(value)) && parseFloat(value) >= 0;

// Chats Validations
exports.listingIdValidation = [
  param("listingId").custom(
    validate(isMongoId, "ID must be a valid MongoDB ID")
  ),
];
exports.currentUserIdValidation = [
  query("uuid")
    .isUUID(4)
    .withMessage("Current user UUID must be a valid UUIDv4"),
];

// Listing Validations
exports.limitValidation = [
  query("limit")
    .optional()
    .custom(validate(isPositiveInteger, "Limit must be a positive integer")),
];
exports.createListingValidation = [
  body("uuid")
    .exists()
    .withMessage("UUID is required")
    .custom(validate(isUUIDv4, "Must be a valid UUIDv4")),
  body("listingName").exists().withMessage("Listing name is required"),
  body("price")
    .exists()
    .withMessage("Price is required")
    .custom(
      validate(isNonNegativeNumber, "Price must be a non-negative number")
    ),
];

exports.updateListingValidation = [
  // Custom validation for MongoDB ID
  param("listingId").custom(
    validate(isMongoId, "ID must be a valid MongoDB ID")
  ),
  body("listingName").optional(),
  body("description").optional(),
  body("price")
    .optional()
    .custom(
      validate(isNonNegativeNumber, "Price must be a non-negative number")
    ),
];

// User Validations
exports.uuidValidation = [
  param("uuid").isUUID(4).withMessage("UUID must be a valid UUIDv4"),
];
exports.userIdValidation = [
  // Built-in validation for MongoDB ID
  param("userId").isMongoId().withMessage("User ID must be a valid MongoDB ID"),
];

// Message Validations
exports.getMessagesInChatValidation = [
  // Built-in validation for MongoDB ID
  param("listingId")
    .isMongoId()
    .withMessage("Listing ID must be a valid MongoDB ID"),
  check("uuid")
    .isUUID(4)
    .withMessage("UUID must be a valid UUIDv4 in the request query"),
];

exports.createMessageInChatValidation = [
  // Built-in validation for MongoDB ID
  param("listingId")
    .isMongoId()
    .withMessage("Listing ID must be a valid MongoDB ID"),
  check("uuid").isUUID(4).withMessage("Sender UUID must be a valid UUIDv4"),
  check("content").custom(
    validate(
      isNonEmptyString,
      "Message content is required and must be a non-empty string"
    )
  ),
];
