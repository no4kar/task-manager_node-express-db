// @ts-check
'use strict';

import jwt from 'jsonwebtoken';
import { env } from '../configs/env.config.js';

export const jwtService = {
  generateAccessToken,
  generateRefreshToken,
  validateAccessToken,
  validateRefreshToken,
};

/** @param {import('src/types/user.type.js').TyUser.Item} user */
function generateAccessToken(user) {
  return jwt.sign(user, env.jwt.secret.access, { expiresIn: '1h' });
}

/** @param {string} token */
function validateAccessToken(token) {
  try {
    return jwt.verify(token, env.jwt.secret.access);
  } catch (error) {
    return null;
  }
}

/** @param {import('src/types/user.type.js').TyUser.Item} user */
function generateRefreshToken(user) {
  return jwt.sign(user, env.jwt.secret.refresh, { expiresIn: '10d' });
}

/** @param {string} token */
function validateRefreshToken(token) {
  try {
    return jwt.verify(token, env.jwt.secret.refresh);
  } catch (error) {
    return null;
  }
}