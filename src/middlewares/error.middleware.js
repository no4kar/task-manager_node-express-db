'use strict';
// @ts-check

import { ApiError } from '@src/exceptions/api.error.js';

/** @type {import('@src/types/func.type.js').ErrorMiddleware} */
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
 *  @param {import("@src/types/func.type").Middleware} action
 * @returns {import("@src/types/func.type").Middleware} */
export function catchError(action) {
  return async (req, res, next) => {
    try {
      await action(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
