const mongoose = require("mongoose");
const SuspiciousActivityLog = require("./SuspiciousActivityLog"); // Import your SuspiciousActivityLog model
const fs = require("fs");

let restrictedItems;

fs.readFile("./data/restrictedItems.txt", function (err, data) {
  if (err) throw err;
  restrictedItems = data
    .toString()
    .split("\n")
    .filter((item) => item.trim() !== "");
});

function containsRestrictedWords(str) {
  const lowercaseStr = str.toLowerCase();
  return restrictedItems.some((restrictedItem) =>
    lowercaseStr.includes(restrictedItem)
  );
}

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

// Define a pre-save middleware function to check for restricted words
listingSchema.pre("save", async function (next) {
  const listing = this;
  const containsRestrictedName = containsRestrictedWords(listing.listingName);
  const containsRestrictedDescription = containsRestrictedWords(
    listing.description
  );

  if (containsRestrictedName || containsRestrictedDescription) {
    const newLog = new SuspiciousActivityLog({
      user: listing.seller,
      reason: "Attempt to list a potentially restricted item",
    });

    try {
      await newLog.save();
      listing.seller.flags += 1;
      return next(new Error("Listing contains potentially restricted item"));
    } catch (error) {
      return next(error);
    }
  }

  return next();
});

// Create a custom function to update listings with word checks
listingSchema.statics.findByIdAndUpdateWithCheck = async function (
  id,
  update,
  options
) {
  const listing = await this.findById(id);

  if (!listing) {
    throw new Error("Listing not found");
  }

  // Check for restricted words in the update data
  const containsRestrictedName = containsRestrictedWords(
    update.listingName || ""
  );
  const containsRestrictedDescription = containsRestrictedWords(
    update.description || ""
  );

  if (containsRestrictedName || containsRestrictedDescription) {
    const newLog = new SuspiciousActivityLog({
      user: listing.seller,
      reason: "Attempt to update a listing with potentially restricted content",
    });

    try {
      await newLog.save();
      listing.seller.flags += 1;
      throw new Error("Update contains potentially restricted content");
    } catch (error) {
      throw error;
    }
  }

  // If no restricted words, perform the update
  return this.findByIdAndUpdate(id, update, options);
};

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
