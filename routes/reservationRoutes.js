const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/ReservationController");
const {
  createReservationValidation,
  updateReservationValidation,
} = require("./middleware/validation");

// [GET] Get a reservation by ID
router.get("/:reservationId", reservationController.getReservationById);

// [GET] Get all reservations by Listing ID
router.get(
  "/listing/:listingId",
  reservationController.getReservationsByListingId
);

// [POST] Create a new reservation
router.post(
  "/",
  createReservationValidation,
  reservationController.createReservation
);

// [PATCH] Update a reservation by ID
router.patch(
  "/:reservationId",
  updateReservationValidation,
  reservationController.updateReservationById
);

module.exports = router;
