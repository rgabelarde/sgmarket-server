class NotFoundError extends Error {
  constructor(message) {
    super(message || "Not Found");
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message || "Internal Server Error");
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

class Error4xx extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;

    switch (message) {
      case "No fields provided for data update":
        this.name = "EmptyFieldError";
        break;

      case "userId parameter is missing in the URL":
      case "UUID parameter is missing from the URL":
      case "Reservation Id is missing from the URL":
      case "logId parameter is missing from the URL":
      case "listingId parameter is missing from the URL":
      case "buyerUUID parameter is missing from the URL":
        this.name = "URLParamMissingError";
        break;

      case "UUID and reason are required request body fields":
      case "UUID is a required request body field":
      case "listingId, isMailing, and priceOffer are required request body fields":
      case "No parameters provided for update, request body is empty":
      case "UUID (buyer's) and content are required request body fields":
      case "UUID (buyer's) OR chatId are required request body fields":
      case "Content in message is a required request body field":
      case "UUID, listingName, and price are required request body fields":
        this.name = "ReqBodyParamMissingError";
        break;

      case "Start and/or End date missing from query parameters":
      case "reportedBy missing from query parameters":
      case "UUID missing from query parameters":
        this.name = "QueryParamMissingError";
        break;

      case "Buyer cannot be the seller, you cannot reserve your own listing!":
      case "Seller cannot enquire on their own listing":
        this.name = "SameUserNotAllowedError";
        this.statusCode = 412;
        break;

      case "sellerUUID does not match listing owner's uuid":
        this.name = "InvalidDataError";
        this.statusCode = 412;
        break;

      case "Existing reservation for this item exists, use update instead":
      case "Cannot approve reservation for a listing with status other than 'available'":
      case "Listing has already been successfully reserved or sold":
      case "Unable to update reservation info for item that has been received":
        this.name = "ItemReservedError";
        break;

      case "User with the same username (case insensitive), email, or uuid already exists":
        this.name = "DuplicateUserCreationError";
        this.statusCode = 409;
        break;

      case "You do not have permission to access these reservations":
      case "Cannot make changes to others' reservations":
        this.name = "UnauthorizedOrRestrictedAccess";
        this.statusCode = 401;
        break;

      default:
        this.name = "InternalServerError";
        this.statusCode = 500;
        break;
    }
  }
}

module.exports = {
  NotFoundError,
  InternalServerError,
  Error4xx,
};
