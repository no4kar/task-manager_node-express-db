// @ts-check
'use strict';

import { ApiError } from '../exceptions/api.error.js';

/** @type {import('../types/func.type.js').ErrorMiddleware} */
export function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (error instanceof ApiError) {
    const { status, message, errors } = error;

    res.status(status)
      .send({
        message,
        error: errors,
      });

    return;
  }

  const unexpectedError = new Error(error);

  res.status(500)
    .send({
      message: unexpectedError.message,
      error: unexpectedError.stack,
    });
}

/**
 *  @param {import("../types/func.type").Middleware} action
 * @returns {import("../types/func.type").Middleware} */
export function catchError(action) {
  return async (req, res, next) => {
    try {
      await action(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
