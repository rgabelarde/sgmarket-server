const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/ReservationController");
const {
  createReservationValidation,
  updateReservationValidation,
} = require("../common/middleware/validation");

// [GET] Get all reservations by Listing ID
router.get(
  "/view/all/:listingId",
  reservationController.getReservationsByListingId
);

// [GET] Get a reservation by ID
router.get("/view/:reservationId", reservationController.getReservationById);

// [POST] Create a new reservation
router.post(
  "/reserve/:listingId",
  createReservationValidation,
  reservationController.createReservation
);

// [PATCH] Update a reservation by ID
router.patch(
  "/update/:reservationId",
  updateReservationValidation,
  reservationController.updateReservationById
);

// // [PATCH] Update a reservation by ID
// router.patch(
//   "/sold/:reservationId",
//   updateReservationValidation,
//   reservationController.updateReservationById
// );

module.exports = router;
