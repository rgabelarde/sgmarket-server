const express = require("express");
const suspiciousActivityLogController = require("../controllers/SuspiciousActivityLogController");
const {
  uuidValidation,
  suspiciousActivityLogValidation,
  suspiciousActivityLogIdValidation,
} = require("../common/middleware/validation");

const router = express.Router();

// [GET] Get a suspicious activity log by ID
router.get(
  "/view/:logId",
  suspiciousActivityLogIdValidation,
  suspiciousActivityLogController.getSuspiciousActivityLogById
);

// [GET] Get all suspicious activity logs of a single user by UUID
router.get(
  "/view/all/user/:uuid/",
  uuidValidation,
  suspiciousActivityLogController.getAllSuspiciousActivityLogsByUserId
);

// [POST] Create a new suspicious activity log
router.post(
  "/create/log",
  suspiciousActivityLogValidation,
  suspiciousActivityLogController.createSuspiciousActivityLog
);

// [DELETE] Delete a suspicious activity log by ID
router.delete(
  "/delete/:logId",
  suspiciousActivityLogIdValidation,
  suspiciousActivityLogController.deleteSuspiciousActivityLogById
);

// [GET] Get suspicious activity logs by date range
router.get(
  "/view/range/user/:uuid",
  uuidValidation,
  suspiciousActivityLogController.getSuspiciousActivityLogsByDateRange
);

module.exports = router;
