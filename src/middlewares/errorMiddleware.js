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
        message, errors,
      });

    return;
  }

  res.status(500)
    .send({
      message: 'Unexpected error',
    });
}
