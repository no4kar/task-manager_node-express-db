'use strict';
// @ts-check

import { userService } from '../services/mongoose/user.service.js';

export const userController = {
  getAll,
};

/** @type {import('src/types/func.type.js').Middleware} */
async function getAll(req, res) {
  const users = await userService.getActives();

  res.send(users.map(item => userService.normalize(userService.toObject(item))));
}