const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listingName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  description: {
    type: String,
    minlength: 1,
  },
  status: {
    type: String,
    enum: ["available", "reserved", "sold"],
    required: true,
    default: "available",
  },
  price: {
    type: Number,
    min: 0,
    get: (value) => value.toFixed(2),
    set: (value) => parseFloat(value.toFixed(2)),
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
