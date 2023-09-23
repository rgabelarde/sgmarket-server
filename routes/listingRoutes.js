const express = require("express");
const router = express.Router();
const listingController = require("../controllers/ListingController");
const {
  listingIdValidation,
  limitValidation,
  createListingValidation,
  updateListingValidation,
} = require("../common/middleware/validation");

// [GET] Get a listing by ID
router.get(
  "/view/:listingId",
  listingIdValidation,
  listingController.getListingById
);

// [GET] Get listings with an optional limit parameter
router.get("/view", limitValidation, listingController.getListingsWithLimit);

// [POST] Create a new listing
router.post("/new", createListingValidation, listingController.createListing);

// [PATCH] Update a listing by ID
router.patch(
  "/update/:listingId",
  updateListingValidation,
  listingController.updateListingById
);

module.exports = router;
