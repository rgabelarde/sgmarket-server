import Reservation from "../models/Reservation";

// Helper function to handle errors
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// [GET] Get a reservation by ID
export const getReservationById = async (req, res) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return handleError(res, 404, "Reservation not found");
    }

    res.json(reservation);
  } catch (error) {
    return handleError(res, 500, error.message ?? "Internal Server Error");
  }
};
// [POST] Create a new reservation
export const createReservation = async (req, res) => {
  const { listingId, uuid, isMailing, meetupLocation, priceOffer } = req.body;

  try {
    // Check if required fields are missing
    if (!listingId || !uuid || isMailing === undefined || !priceOffer) {
      return handleError(
        res,
        400,
        "listingId, uuid, isMailing, and priceOffer are required fields"
      );
    }

    const user = await User.findOne({ uuid });

    if (!user) {
      handleError(res, 404, "User not found");
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
    return handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// [PUT] Update a reservation by ID
export const updateReservationById = async (req, res) => {
  const { reservationId } = req.params;
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
      return handleError(res, 400, "No fields provided for update");
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      updatedFields,
      { new: true } // Return updated document
    );

    if (!updatedReservation) {
      return handleError(res, 404, "Reservation not found");
    }

    res.json(updatedReservation);
  } catch (error) {
    return handleError(res, 500, error.message ?? "Internal Server Error");
  }
};
