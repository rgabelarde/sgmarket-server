const Reservation = require("../models/Reservation");
const User = require("../models/User");
const Listing = require("../models/Listing");
const { NotFoundError, Error4xx } = require("../common/utils/errorValues");
const { handleError } = require("../common/utils/errorHandler");

// [GET] Get a reservation by ID
exports.getReservationById = async (req, res) => {
  const reservationId = req.params.reservationId;
  if (!reservationId) {
    throw new Error4xx("Reservation Id is missing from the URL");
  }

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }

    res.json(reservation);
  } catch (error) {
    handleError(res, error);
  }
};

// [GET] Get all reservations by Listing ID
exports.getReservationsByListingId = async (req, res) => {
  const listingId = req.params.listingId;
  if (!listingId) {
    throw new Error4xx("listingId parameter is missing from the URL");
  }

  try {
    // Find all reservations with the given listingId
    const reservations = await Reservation.find({ listingId });

    res.json(reservations);
  } catch (error) {
    handleError(res, error);
  }
};

// [POST] Create a new reservation
exports.createReservation = async (req, res) => {
  const { listingId, buyerUUID, isMailing, meetupLocation, priceOffer } =
    req.body;

  try {
    // Check if required fields are missing
    if (!listingId || !buyerUUID || isMailing === undefined || !priceOffer) {
      throw new Error4xx(
        "listingId, buyerUUID, isMailing, and priceOffer are required request body fields"
      );
    }

    // Find the listing to get the seller's UUID
    const listing = await Listing.findById(listingId);

    if (!listing) {
      throw new NotFoundError("Listing not found");
    }
    // Check if the buyerUUID is the same as the seller's UUID
    if (buyerUUID === listing.seller.uuid) {
      throw new Error4xx(
        "Buyer cannot be the seller, you cannot reserve your own listing!"
      );
    }

    const user = await User.findOne({ uuid: buyerUUID });
    if (!user) {
      throw new NotFoundError("Current user not found");
    }

    // Create a new reservation document based on the request body
    const newReservationData = {
      listingId,
      buyerId: user._id, // Use the retrieved user's _id as buyerId
      isMailing,
      priceOffer,
    };
    // Only set meetupLocation if isMailing is false
    if (!isMailing) {
      newReservationData.meetupLocation = meetupLocation;
    }
    const newReservation = new Reservation(newReservationData);
    // Save the new reservation to the database
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    handleError(res, error);
  }
};

// [PATCH] Update a reservation by ID
exports.updateReservationById = async (req, res) => {
  const reservationId = req.params.reservationId;
  if (!reservationId) {
    throw new Error4xx("Reservation Id is missing from the URL");
  }
  const updateFields = [
    "approvalStatus",
    "isMailing",
    "meetupLocation",
    "paymentStatus",
    "priceOffer",
    "isReceived",
  ];
  const updatedFields = {};

  // Iterate over the fields and update if defined in the request body
  for (const field of updateFields) {
    if (req.body[field] !== undefined) {
      updatedFields[field] = req.body[field];
    }
  }

  try {
    if (Object.keys(updatedFields).length === 0) {
      throw new Error4xx(
        "No parameters provided for update, request body is empty"
      );
    }

    // Check if approvalStatus is being changed to 'approved'
    if (
      updatedFields.approvalStatus === "approved" &&
      (await isListingStatusNotAvailable(updatedFields.listingId))
    ) {
      throw new Error4xx(
        "Cannot approve reservation for a listing with status other than 'available'"
      );
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      updatedFields,
      { new: true } // Return updated document
    );

    if (!updatedReservation) {
      throw new NotFoundError("Reservation not found");
    }

    res.json(updatedReservation);
  } catch (error) {
    handleError(res, error);
  }
};

// Helper function to check if listing status is not 'available'
const isListingStatusNotAvailable = async (listingId) => {
  const listing = await Listing.findById(listingId);
  return listing ? listing.status !== "available" : false;
};
