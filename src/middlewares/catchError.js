/**
 *  @param {import("../types/todo.type").TyFuncController} action
 * @returns {import("../types/todo.type").TyFuncController} */
export function catchError(action) {
  return async(req, res, next) => {
    try {
      await action(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
