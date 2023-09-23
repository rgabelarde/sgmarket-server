const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isMailing: {
    type: Boolean,
    required: true,
  },
  meetupLocation: {
    type: String,
    required: function () {
      // Required if 'isMailing' is false
      return !this.isMailing;
    },
    minlength: 10,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  priceOffer: {
    type: Number,
    required: true,
    get: (value) => value.toFixed(2),
    set: (value) => parseFloat(value.toFixed(2)),
  },
  isReceived: {
    type: Boolean,
    default: false,
  },
});

// Create a compound unique index on 'listingId' and 'buyerId'
reservationSchema.index({ listingId: 1, buyerId: 1 }, { unique: true });

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
