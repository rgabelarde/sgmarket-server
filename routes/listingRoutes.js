const express = require("express");
const router = express.Router();
const listingController = require("../controllers/ListingController");
const {
  listingIdValidation,
  limitValidation,
  createListingValidation,
  updateListingValidation,
} = require("./middleware/validation");

// Get a listing by ID
router.get(
  "/:listingId",
  listingIdValidation,
  listingController.getListingById
);

// Get listings with an optional limit parameter
router.get("/", limitValidation, listingController.getListingsWithLimit);

// Create a new listing
router.post("/", createListingValidation, listingController.createListing);

// Update a listing by ID
router.patch(
  "/:listingId",
  updateListingValidation,
  listingController.updateListingById
);

module.exports = router;
