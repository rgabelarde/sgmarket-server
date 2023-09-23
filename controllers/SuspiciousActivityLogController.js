const SuspiciousActivityLog = require("../models/SuspiciousActivityLog");
const User = require("../models/User");
const { NotFoundError, Error4xx } = require("../common/utils/errorValues");
const { handleError } = require("../common/utils/errorHandler");

// [GET] Get a suspicious activity log by ID
exports.getSuspiciousActivityLogById = async (req, res) => {
  const logId = req.params.logId;

  try {
    if (!logId) {
      throw new Error4xx("logId parameter is missing from the URL");
    }
    const log = await SuspiciousActivityLog.findById(logId);

    if (!log) {
      throw new NotFoundError("Suspicious Activity Log not found");
    }

    res.json(log);
  } catch (error) {
    handleError(res, error);
  }
};

// [GET] Get all suspicious activity logs of a single user by UUID
exports.getAllSuspiciousActivityLogsByUserId = async (req, res) => {
  const uuid = req.params.uuid;

  try {
    if (!uuid) {
      throw new Error4xx("UUID parameter is missing from the URL");
    }
    // Check if the user with the specified UUID exists
    const user = await User.findOne({ uuid });

    if (!user) {
      throw new NotFoundError("Current user not found");
    }

    // Retrieve all suspicious activity logs for the user
    const logs = await SuspiciousActivityLog.find({ user: user._id });

    res.json(logs);
  } catch (error) {
    handleError(res, error);
  }
};

// [POST] Create a new suspicious activity log
exports.createSuspiciousActivityLog = async (req, res) => {
  const { uuid, reason } = req.body;
  const { reportedBy } = req.query;

  try {
    // Check if required fields are missing
    if (!uuid || !reason) {
      throw new Error4xx("UUID and reason are required request body fields");
    }
    // Check if the user with the specified UUID exists
    const user = await User.findOne({ uuid });
    if (!user) {
      throw new NotFoundError("Current user not found");
    }

    const newLogData = {
      user: user._id,
      reportedBy: reportedBy || "System Generated",
      reason,
    };
    const newLog = new SuspiciousActivityLog(newLogData);
    // Save the new log to the database
    const savedLog = await newLog.save();

    user.flags += 1;
    if (user.flags >= 3) {
      user.biometricVerified = false;
    }
    await user.save();
    res.status(201).json({ log: savedLog, user: user });
  } catch (error) {
    handleError(res, error);
  }
};

// [DELETE] Delete a suspicious activity log by ID
exports.deleteSuspiciousActivityLogById = async (req, res) => {
  const logId = req.params.logId;

  try {
    if (!logId) {
      throw new Error4xx("logId parameter is missing from the URL");
    }
    const deletedLog = await SuspiciousActivityLog.findByIdAndDelete(logId);
    if (!deletedLog) {
      throw new NotFoundError("Suspicious Activity Log not found");
    }
    res.json({ message: "Suspicious Activity Log deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

// [GET] Get suspicious activity logs by date range
exports.getSuspiciousActivityLogsByDateRange = async (req, res) => {
  const uuid = req.params.uuid;
  const { startDate, endDate } = req.query;

  try {
    if (!uuid) {
      throw new Error4xx("UUID is a required request body field");
    }
    if (!startDate || !endDate) {
      throw new Error4xx("Start and/or End date missing from query parameters");
    }

    // Check if the user with the specified UUID exists
    const user = await User.findOne({ uuid });

    if (!user) {
      throw new NotFoundError("Current user not found");
    }

    // Define a date range query
    const dateQuery = {
      user: user._id,
      reportedOn: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    // Retrieve suspicious activity logs within the specified date range
    const logs = await SuspiciousActivityLog.find(dateQuery);

    res.json(logs);
  } catch (error) {
    handleError(res, error);
  }
};
