import SuspiciousActivityLog from "../models/SuspiciousActivityLog";
import User from "../models/User";

// Helper function to handle errors
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// [GET] Get a suspicious activity log by ID
export const getSuspiciousActivityLogById = async (req, res) => {
  const { logId } = req.params;

  try {
    const log = await SuspiciousActivityLog.findById(logId);

    if (!log) {
      handleError(res, 404, "Suspicious Activity Log not found");
    }

    res.json(log);
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// [GET] Get all suspicious activity logs of a single user by UUID
export const getAllSuspiciousActivityLogsByUserId = async (req, res) => {
  const { uuid } = req.params;

  try {
    // Check if the user with the specified UUID exists
    const user = await User.findOne({ uuid });

    if (!user) {
      handleError(res, 404, "User not found");
    }

    // Retrieve all suspicious activity logs for the user
    const logs = await SuspiciousActivityLog.find({ userId: user._id });

    res.json(logs);
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// [POST] Create a new suspicious activity log
export const createSuspiciousActivityLog = async (req, res) => {
  const { uuid, reason } = req.body;
  const { reportedBy } = req.query;

  try {
    // Check if required fields are missing
    if (!uuid || !reason) {
      handleError(res, 400, "UUID and reason are required fields");
    }

    // Check if the user with the specified UUID exists
    const user = await User.findOne({ uuid });

    if (!user) {
      handleError(res, 404, "User not found");
    }

    const newLogData = {
      userId: user._id,
      reportedBy: reportedBy || "System Generated",
      reason,
    };

    const newLog = new SuspiciousActivityLog(newLogData);

    // Save the new log to the database
    const savedLog = await newLog.save();

    res.status(201).json(savedLog);
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// [DELETE] Delete a suspicious activity log by ID
export const deleteSuspiciousActivityLogById = async (req, res) => {
  const { logId } = req.params;

  try {
    const deletedLog = await SuspiciousActivityLog.findByIdAndDelete(logId);

    if (!deletedLog) {
      handleError(res, 404, "Suspicious Activity Log not found");
    }

    res.json({ message: "Suspicious Activity Log deleted successfully" });
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};

// [GET] Get suspicious activity logs by date range
export const getSuspiciousActivityLogsByDateRange = async (req, res) => {
  const { uuid } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // Check if the user with the specified UUID exists
    const user = await User.findOne({ uuid });

    if (!user) {
      handleError(res, 404, "User not found");
    }

    // Define a date range query
    const dateQuery = {
      userId: user._id,
      reportedOn: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    // Retrieve suspicious activity logs within the specified date range
    const logs = await SuspiciousActivityLog.find(dateQuery);

    res.json(logs);
  } catch (error) {
    handleError(res, 500, error.message ?? "Internal Server Error");
  }
};
