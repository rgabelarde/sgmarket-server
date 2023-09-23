const Listing = require("../models/Listing");
const User = require("../models/User");
const { NotFoundError, Error4xx } = require("../common/utils/errorValues");
const { handleError } = require("../common/utils/errorHandler");

// [GET] Get a listing by ID
exports.getListingById = async (req, res) => {
  const listingId = req.params.listingId;

  try {
    if (!listingId) {
      throw new Error4xx("listingId parameter is missing in the URL");
    }
    const listing = await Listing.findById(listingId).populate("seller");
    if (!listing) {
      throw new NotFoundError("Listing not found");
    }
    res.json(listing);
  } catch (error) {
    handleError(res, error);
  }
};

// [GET] Get listings with optional limit parameter
exports.getListingsWithLimit = async (req, res) => {
  const { limit } = req.query;
  try {
    let query = Listing.find();
    // Check if a limit parameter is provided and it's a positive integer
    if (limit && /^\d+$/.test(limit) && parseInt(limit) > 0) {
      query = query.limit(parseInt(limit));
    }
    const listings = await query.exec();
    res.json(listings);
  } catch (error) {
    handleError(res, error);
  }
};

// [POST] Create a new listing
exports.createListing = async (req, res) => {
  const { uuid, listingName, description, price } = req.body;

  try {
    // Check if required fields are missing
    if (!uuid || !listingName || !price) {
      throw new Error4xx(
        "UUID, listingName, and price are required request body fields"
      );
    }

    // Find the seller based on the UUID
    const seller = await User.findOne({ uuid });
    if (!seller) {
      throw new NotFoundError("Seller not found");
    }
    // Create a new listing document based on the request body
    const newListing = new Listing({
      seller: seller, // Set the seller as the entire User object
      listingName,
      description,
      price,
    });

    // Save the new listing to the database
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    handleError(res, error);
  }
};

// [PATCH] Update a listing by ID
exports.updateListingById = async (req, res) => {
  const listingId = req.params.listingId;
  const updateFields = ["listingName", "description", "price", "status"];
  const updatedFields = {};

  updateFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updatedFields[field] = req.body[field];
    }
  });

  try {
    if (!listingId) {
      throw new Error4xx("listingId parameter is missing in the URL");
    }

    if (Object.keys(updatedFields).length === 0) {
      throw new Error4xx(
        "No parameters provided for update, request body is empty"
      );
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      updatedFields,
      { new: true } // Return updated document
    );

    if (!updatedListing) {
      throw new NotFoundError("Listing not found");
    }

    res.json(updatedListing);
  } catch (error) {
    handleError(res, error);
  }
};
