'use strict';
// @ts-check

/**
 * @typedef {import('src/types/func.type.js').TyFunc.ApiError.StaticMethod} ApiErrorStaticMethod
*/

/**
 * @template {string} T1
 * @typedef {import('src/types/error.type').TyError.FailedReport<T1>} TyFailedReport
*/

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
  static BadRequest(
    message = 'Bad Request',
    errors,
  ) {
    return new ApiError(400, message, errors);
  }

  /** Indicates that a request was not successful because it lacks valid authentication credentials for the requested resource 
   * @type {ApiErrorStaticMethod} */
  static Unauthorized(
    message = 'Unauthorized',
    errors,
  ) {
    return new ApiError(401, message, errors);
  }

  /** Indicates that the server understood the request but refused to process it 
   * @type {ApiErrorStaticMethod} */
  static Forbidden(
    message = 'Forbidden',
    errors,
  ) {
    return new ApiError(403, message, errors);
  }

  /** Indicates that the server cannot find the requested resource
   * @type {ApiErrorStaticMethod} */
  static NotFound(
    message = 'Not found',
    errors,
  ) {
    return new ApiError(404, message, errors);
  }

  /** Indicates a request conflict with the current state of the target resource
   * @type {ApiErrorStaticMethod} */
  static Conflict(
    message = 'Conflict',
    errors,
  ) {
    return new ApiError(409, message, errors);
  }

  /** The server understood the content type of the request entity, and the syntax of the request entity was correct, but it was unable to process the contained instructions
   * @type {ApiErrorStaticMethod} */
  static UnprocessableContent(
    message = 'Unprocessable Entity',
    errors,
  ) {
    return new ApiError(422, message, errors);
  }

  /** The client has sent too many requests in a given amount of time 
   * @type {ApiErrorStaticMethod} */
  static TooManyRequests(
    message = 'Too Many Requests',
    errors,
  ) {
    return new ApiError(429, message, errors);
  }

/**
   * Validates input data based on the given error flags and expected types.
   * Usage: FailedReport(errors, "Validation failed", ApiError.BadRequest);
   * 
   * @template {string} T1
   * @param {TyFailedReport<T1>} errors - An object where keys represent field names and values indicate validation errors (truthy if invalid).
   * @param {string} [message] - The error message. 'Type error' by default.
   * @param {(message?: string, errors?: Object) => ApiError} [ApiErrorMethod] - A function that returns an ApiError instance. 'ApiError.UnprocessableContent' by default.
   * @returns {ApiError} If any validation fails, an error with expected and actual types is thrown.
   */
  static FailedReport(
    errors,
    message = 'Type error',
    ApiErrorMethod = ApiError.UnprocessableContent,
  ) {
    const failed = Object.entries(errors)
      .reduce((acc, [key, error]) => {
        if (error.isInvalid) { // Keep only invalid fields
          acc.expected[key] = error.expected;
          acc.got[key] = error.got;
        }

        return acc;
      }, { expected: {}, got: {} });

    return ApiErrorMethod(message, failed);
  }
};
