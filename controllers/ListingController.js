const Listing = require("../models/Listing");
const User = require("../models/User");

// Helper function to handle errors
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// [GET] Get a listing by ID
exports.getListingById = async (req, res) => {
  const listingId = req.params.listingId;

  try {
    const listing = await Listing.findById(listingId).populate("seller");
    if (!listing) {
      return handleError(res, 404, "Listing not found");
    }
    res.json(listing);
  } catch (error) {
    return handleError(res, 500, error.message ?? "Internal Server Error");
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
    return handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// [POST] Create a new listing
exports.createListing = async (req, res) => {
  const { uuid, listingName, description, price } = req.body;

  try {
    // Check if required fields are missing
    if (!uuid || !listingName || !price) {
      return handleError(
        res,
        400,
        "UUID, listingName, and price are required fields"
      );
    }

    // Find the seller based on the UUID
    const seller = await User.findOne({ uuid });
    if (!seller) {
      return handleError(res, 404, "Seller not found");
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
    return handleError(res, 500, error.message ?? "Internal Server Error");
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
    if (Object.keys(updatedFields).length === 0) {
      return handleError(res, 400, "No fields provided for update");
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      updatedFields,
      { new: true } // Return updated document
    );

    if (!updatedListing) {
      return handleError(res, 404, "Listing not found");
    }

    res.json(updatedListing);
  } catch (error) {
    return handleError(res, 500, error.message ?? "Internal Server Error");
  }
};
