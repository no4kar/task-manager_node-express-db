import { ApiError } from '../exceptions/todo.error.js';

/* eslint no-console: "warn" */

/** @type {import('../types/todo.type.js').TyFuncErrorMiddleware} */
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
