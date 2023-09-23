const express = require("express");
const suspiciousActivityLogController = require("../controllers/SuspiciousActivityLogController");
const {
  uuidValidation,
  suspiciousActivityLogValidation,
  suspiciousActivityLogIdValidation,
} = require("./middleware/validation");

const router = express.Router();

// Get a suspicious activity log by ID
router.get(
  "/log/:logId",
  suspiciousActivityLogIdValidation,
  suspiciousActivityLogController.getSuspiciousActivityLogById
);

// Get all suspicious activity logs of a single user by UUID
router.get(
  "/user/:uuid/logs",
  uuidValidation,
  suspiciousActivityLogController.getAllSuspiciousActivityLogsByUserId
);

// Create a new suspicious activity log
router.post(
  "/log",
  suspiciousActivityLogValidation,
  createSuspiciousActivityLog
);

// Delete a suspicious activity log by ID
router.delete(
  "/log/:logId",
  suspiciousActivityLogIdValidation,
  deleteSuspiciousActivityLogById
);

// Get suspicious activity logs by date range
router.get(
  "/user/:uuid/logs/range",
  uuidValidation,
  getSuspiciousActivityLogsByDateRange
);

module.exports = router;
