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

  /**
   * @param {string} message
   * @param {Error | Object} [errors={}] */
  static BadRequest(message, errors) {
    return new ApiError(400, message, errors);
  }

  /** Authentication is required and has either not been provided or has failed */
  static Unauthorized(message = 'User is not authorized') {
    return new ApiError(401, message);
  }

  /** The client should not try again with the same credentials or request */
  static Forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static NotFound(message = 'Not found') {
    return new ApiError(404, message);
  }

  static Conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  /**
 * @param {string} message
 * @param {Error | Object} [errors={}] */
  static UnprocessableEntity(message = 'Invalid Data', errors) {
    return new ApiError(422, message, errors);
  }
};
