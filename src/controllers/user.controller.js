'use strict';
// @ts-check

import { userService } from '../services/user.service.js';

export const userController = {
  getAll,
};

/** @type {import('src/types/func.type.js').Middleware} */
async function getAll(req, res) {
  const users = await userService.getAllActive();

  res.send(users.map(item => userService.normalize(item.dataValues)));
}