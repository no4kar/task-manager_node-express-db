'use strict';
// @ts-check

/**
 *  @param {import("../types/func.type").Controller} action
 * @returns {import("../types/func.type").Controller} */
export function catchError(action) {
  return async(req, res, next) => {
    try {
      await action(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
