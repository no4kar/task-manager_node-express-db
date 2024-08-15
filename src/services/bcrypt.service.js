'use strict';
// @ts-check

import bcrypt from 'bcrypt';
import { bcrypt as bcryptConfig } from '../configs/env.config.js';

export const bcryptService = {
  hash,
  compare,
};

/** @param {string | Buffer} data */
function hash(data) {
  return bcrypt.hash(data, bcryptConfig.hash.saltOrRounds);
}

/** 
 * @param {string | Buffer} data
 * @param {string} encrypted */
function compare(data, encrypted) {
  return bcrypt.compare(data, encrypted);
}
