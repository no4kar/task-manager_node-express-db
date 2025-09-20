'use strict';
// @ts-check

import { userService as usrSrv } from '../services/user.service.js';

export const userController = {
  getAll,
};

/** 
 * @typedef {import('src/types/func.type.js')
 * .TyFunc.Middleware
 * } TyFuncMiddleware
 * 
 * @typedef {import('src/types/func.type.js')
 * .TyFunc.AsyncMiddleware
 * } TyFuncAsyncMiddleware
 */

/** @type {TyFuncAsyncMiddleware} */
async function getAll(req, res) {
  const users
    = await usrSrv.getActives();

  res.send(users.map(item =>
    usrSrv.prepareToSend(item)));
}