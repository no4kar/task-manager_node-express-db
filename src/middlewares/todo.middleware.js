'use strict';
// @ts-check

/**
 * @param { ('delete' | 'update') } action
 * @returns {import("../types/func.type").Controller} */
export const isAction = (action) => {
  return (req, res, next) => {
    if (req.query.action === action) {
      next();// call next handler in a chain
      return;
    } else {
      next('route');// call next route
    }
  };
};
