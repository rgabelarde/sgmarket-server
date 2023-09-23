const Reservation = require("../models/Reservation");
const User = require("../models/User");
const Listing = require("../models/Listing");
const { NotFoundError, Error4xx } = require("../common/utils/errorValues");
const { handleError } = require("../common/utils/errorHandler");

// [GET] Get a reservation by ID
exports.getReservationById = async (req, res) => {
  const reservationId = req.params.reservationId;
  const { uuid } = req.query;

  try {
    if (!reservationId) {
      throw new Error4xx("Reservation Id is missing from the URL");
    }
    if (!uuid) {
      throw new Error4xx("UUID parameter is missing from the URL");
    }

    const reservation = await Reservation.findById(reservationId).populate(
      "buyer"
    );
    if (reservation) {
      // Find the listing to get the seller's UUID
      const listing = await Listing.findById(reservation.listingId).populate(
        "seller"
      );
      if (!listing) {
        throw new NotFoundError("Listing not found");
      }
      console.log(reservation);

      // Check if the seller's UUID matches the provided UUID
      if (!(uuid === listing.seller.uuid || uuid === reservation.buyer.uuid)) {
        throw new Error4xx(
          "You do not have permission to access this reservation"
        );
      }
    } else {
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
  const { uuid } = req.query;

  try {
    if (!listingId) {
      throw new Error4xx("listingId parameter is missing from the URL");
    }
    if (!uuid) {
      throw new Error4xx("UUID parameter is missing from the URL");
    }
    // Find the listing to get the seller's UUID
    const listing = await Listing.findById(listingId).populate("seller");
    if (!listing) {
      throw new NotFoundError("Listing not found");
    }
    // Check if the seller's UUID matches the provided UUID
    if (listing.seller.uuid !== uuid) {
      throw new Error4xx(
        "You do not have permission to access these reservations"
      );
    }
    // Find all reservations with the given listingId
    const reservations = await Reservation.find({ listingId });
    res.json(reservations);
  } catch (error) {
    handleError(res, error);
  }
};

// [POST] Create a new reservation
exports.createReservation = async (req, res) => {
  const { isMailing, meetupLocation, priceOffer } = req.body;
  const { buyerUUID } = req.query;
  const listingId = req.params.listingId;

  try {
    // Check if required fields are missing
    if (!listingId || isMailing === undefined || !priceOffer) {
      throw new Error4xx(
        "listingId, isMailing, and priceOffer are required request body fields"
      );
    }
    if (!buyerUUID) {
      throw new Error4xx("buyerUUID parameter is missing from the URL");
    }

    // Find the listing to get the seller's UUID
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new NotFoundError("Listing not found");
    }
    if (listing.status !== "available") {
      throw new Error4xx(
        "Listing has already been successfully reserved or sold"
      );
    }

    // Check if the buyer has existing reservation
    const buyer = await User.findOne({ uuid: buyerUUID });
    if (buyer) {
      const existingReservation = await Reservation.findOne({
        listingId,
        buyer: buyer._id,
      });
      if (existingReservation) {
        throw new Error4xx(
          "Existing reservation for this item exists, use update instead"
        );
      }
    }

    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    await listing.populate("seller");
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
      buyer: user._id, // Use the retrieved user's _id as buyer
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
  const { buyerUUID } = req.query;
  const updateFields = ["isMailing", "meetupLocation", "priceOffer"];

  try {
    if (!reservationId) {
      throw new Error4xx("Reservation Id is missing from the URL");
    }

    if (!buyerUUID) {
      throw new Error4xx("buyerUUID parameter is missing from the URL");
    }

    const updatedFields = {};

    // Iterate over the fields and update if defined in the request body
    for (const field of updateFields) {
      if (req.body[field] !== undefined) {
        updatedFields[field] = req.body[field];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      throw new Error4xx(
        "No parameters provided for update, request body is empty"
      );
    }

    // Find the reservation by ID
    const reservation = await Reservation.findById(reservationId).populate(
      "buyer"
    );

    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }

    if (reservation.buyer.uuid !== buyerUUID) {
      throw new Error4xx("Cannot make changes to others' reservations");
    }

    // Check if approvalStatus is being changed to 'approved'
    if (reservation.isReceived) {
      throw new Error4xx(
        "Unable to update reservation info for item that has been received"
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
