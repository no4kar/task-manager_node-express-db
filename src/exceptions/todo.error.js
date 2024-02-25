export class ApiError extends Error {
  constructor(status, message, errors = {}) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message, errors) {
    return new ApiError(400, message, errors);
  }

  static Unauthorized(message = 'User is not authorized') {
    return new ApiError(401, message);
  }

  static NotFound(message = 'Not found') {
    return new ApiError(404, message);
  }

  static InvalidData(message = 'Unprocessable entity', errors) {
    return new ApiError(422, message, errors);
  }
};
