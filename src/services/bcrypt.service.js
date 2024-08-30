'use strict';
// @ts-check

import bcrypt from 'bcrypt';
import { env } from '../configs/env.config.js';

export const bcryptService = {
  hash,
  compare,
};

/** @param {string | Buffer} data */
function hash(data) {
  return bcrypt.hash(data, env.bcrypt.hash.saltOrRounds);
}

/** 
 * @param {string | Buffer} data
 * @param {string} encrypted */
function compare(data, encrypted) {
  return bcrypt.compare(data, encrypted);
}
