'use strict';
// @ts-check

import { ApiError } from '../exceptions/apiError.js';
import { logger } from '#utils/logger.js';

/** 
 * @typedef {import('src/types/func.type.js')
 * .TyFunc.ErrorMiddleware
 * } TyFuncErrorMiddleware
 * 
 * @typedef {import('src/types/func.type.js')
 * .TyFunc.Middleware
 * } TyFuncMiddleware
 * 
 * @typedef {import('src/types/func.type.js')
 * .TyFunc.AsyncMiddleware
 * } TyFuncAsyncMiddleware
 * 
 */

/** @type {TyFuncErrorMiddleware} */
export function errorMiddleware(
  error,
  _unused_req,
  res,
  _unused_next,
) {
  logger.error(error);

  if (error instanceof ApiError) {
    const {
      status,
      message,
      errors,
    } = error;

    res.status(status)
      .send({
        message,
        error: errors,
      });

    return;
  }

  const unexpectedError
    = new Error(error);

  res.status(500)
    .send({
      message: unexpectedError.message,
      error: unexpectedError.stack,
    });
}

/**
 * @param {TyFuncMiddleware | TyFuncAsyncMiddleware} action
 * @returns {TyFuncAsyncMiddleware} */
export function catchError(action) {
  return async (req, res, next) => {
    try {
      await action(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
