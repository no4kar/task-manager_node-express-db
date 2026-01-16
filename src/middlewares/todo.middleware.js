'use strict';
// @ts-check

/**
 * @typedef {import("src/types/func.type.js")
 * .TyFunc.Middleware
 * } TyFuncMiddleware
 */

/**
 * @param { ('delete' | 'update') } action
 * @returns {TyFuncMiddleware} */
export function isAction(action) {
  return (req, res, next) => {
    if (req.query.action === action) {
      next();// call next handler in a chain
      return;
    } else {
      next('route');// call next route
    }
  };
};
