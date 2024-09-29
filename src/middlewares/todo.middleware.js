'use strict';
// @ts-check

/**
 * @param { ('delete' | 'update') } action
 * @returns {import("src/types/func.type").Middleware} */
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
