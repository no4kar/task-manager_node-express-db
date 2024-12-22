'use strict';
// @ts-check

/**
 * @typedef {import('src/types/func.type.js').TyFunc.ApiError.StaticMethod} ApiErrorStaticMethod
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
  static BadRequest(message = 'Bad Request', errors) {
    return new ApiError(400, message, errors);
  }

  /** Indicates that a request was not successful because it lacks valid authentication credentials for the requested resource 
   * @type {ApiErrorStaticMethod} */
  static Unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  /** Indicates that the server understood the request but refused to process it */
  static Forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  /** Indicates that the server cannot find the requested resource
   * @type {ApiErrorStaticMethod} */
  static NotFound(message = 'Not found', errors) {
    return new ApiError(404, message, errors);
  }

  /** Indicates a request conflict with the current state of the target resource
   * @type {ApiErrorStaticMethod} */
  static Conflict(message = 'Conflict', errors) {
    return new ApiError(409, message, errors);
  }

  /** The client has sent too many requests in a given amount of time */
  static TooManyRequests(message = 'Too Many Requests') {
    return new ApiError(409, message);
  }

  /** The server understood the content type of the request entity, and the syntax of the request entity was correct, but it was unable to process the contained instructions
   * @type {ApiErrorStaticMethod} */
  static UnprocessableContent(message = 'Unprocessable Entity', errors) {
    return new ApiError(422, message, errors);
  }
};
