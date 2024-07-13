export class ApiError extends Error {
  /**
   * @param {number} status
   * @param {string} message
   * @param {Error | Object} [errors={}]
   */
  constructor(status, message, errors = {}) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  /**
   * @param {string} message
   * @param {Error | Object} [errors={}]
   */
  static BadRequest(message, errors) {
    return new ApiError(400, message, errors);
  }

  static Unauthorized(message = 'User is not authorized') {
    return new ApiError(401, message);
  }

  static NotFound(message = 'Not found') {
    return new ApiError(404, message);
  }

    /**
   * @param {string} message
   * @param {Error | Object} [errors={}]
   */
  static InvalidData(message = 'Unprocessable entity', errors) {
    return new ApiError(422, message, errors);
  }
};
