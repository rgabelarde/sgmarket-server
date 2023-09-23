const mongoose = require("mongoose");

const suspiciousActivityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  reportedBy: {
    type: String,
    required: true,
    default: "System Generated",
  },
  reason: {
    type: String,
    required: true,
    minLength: 1,
  },
  reportedOn: {
    type: Date,
    default: Date.now,
  },
});

const SuspiciousActivityLog = mongoose.model(
  "SuspiciousActivityLog",
  suspiciousActivityLogSchema
);

module.exports = SuspiciousActivityLog;
