const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/ReservationController");
const {
  createReservationValidation,
  updateReservationValidation,
  queryUserUUIDValidation,
} = require("../common/middleware/validation");

// [GET] Get all reservations by Listing ID
router.get(
  "/view/all/:listingId",
  queryUserUUIDValidation,
  reservationController.getReservationsByListingId
);

// [GET] Get a reservation by ID
router.get(
  "/view/:reservationId",
  queryUserUUIDValidation,
  reservationController.getReservationById
);

// [POST] Create a new reservation
router.post(
  "/reserve/:listingId",
  [...createReservationValidation, ...queryUserUUIDValidation],
  reservationController.createReservation
);

// [PATCH] Update a reservation by ID
router.patch(
  "/update/:reservationId",
  [...updateReservationValidation, ...queryUserUUIDValidation],
  reservationController.updateReservationById
);

// [PATCH] Update a reservation by ID for approval
router.patch(
  "/update/approval/:reservationId",
  updateReservationValidation,
  reservationController.updateApprovalStatus
);

// [PATCH] Update a reservation by ID for paymentStatus after buyer paid
router.patch(
  "/update/payment/:reservationId",
  updateReservationValidation,
  reservationController.updatePaymentStatus
);

// [PATCH] Update a reservation by ID for after buyer received item
router.patch(
  "/update/received/:reservationId",
  updateReservationValidation,
  reservationController.updateReceived
);

module.exports = router;
