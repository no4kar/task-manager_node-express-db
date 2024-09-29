export class ApiError extends Error {
  /**
   * @param {number} status
   * @param {string} message
   * @param {Error | Object} [errors={}] */
  constructor(status, message, errors = {}) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  /** Indicates that a request was not successful because it lacks valid authentication credentials for the requested resource
   * @param {string} message
   * @param {Error | Object} [errors={}] */
  static BadRequest(message, errors) {
    return new ApiError(400, message, errors);
  }

  /** Indicates that a request was not successful because it lacks valid authentication credentials for the requested resource */
  static Unauthorized(message = 'User is not authorized') {
    return new ApiError(401, message);
  }

  /** Indicates that the server understood the request but refused to process it */
  static Forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  /** Indicates that the server cannot find the requested resource */
  static NotFound(message = 'Not found') {
    return new ApiError(404, message);
  }

  /** Indicates a request conflict with the current state of the target resource */
  static Conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  /** The client has sent too many requests in a given amount of time */
  static TooManyRequests(message = 'Too Many Requests') {
    return new ApiError(409, message);
  }

  /** The server understood the content type of the request entity, and the syntax of the request entity was correct, but it was unable to process the contained instructions
   * @param {string} message
   * @param {Error | Object} [errors={}] */
  static UnprocessableContent(message = 'Invalid Data', errors) {
    return new ApiError(422, message, errors);
  }
};
