// Helper function to handle errors
exports.handleError = (res, error) => {
  res
    .status(error.statusCode || 500)
    .json({ error: error.message || "Internal Server Error" });
};
