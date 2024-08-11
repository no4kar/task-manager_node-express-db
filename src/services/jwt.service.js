// @ts-check
'use strict';

import jwt from 'jsonwebtoken';
import { jwt as jwtConfig } from '../config.js';

export const jwtService = {
  generateAccessToken,
  generateRefreshToken,
  validateAccessToken,
  validateRefreshToken,
};

/**@param {import('src/types/user.type.js').TyUser.Item} user */
function generateAccessToken(user) {
  return jwt.sign(user, jwtConfig.secret.access, { expiresIn: '30s' });
}

/**@param {string} token */
function validateAccessToken(token) {
  try {
    return jwt.verify(token, jwtConfig.secret.access);
  } catch (error) {
    return null;
  }
}

/**@param {import('src/types/user.type.js').TyUser.Item} user */
function generateRefreshToken(user) {
  return jwt.sign(user, jwtConfig.secret.refresh, { expiresIn: '1d' });
}

/**@param {string} token */
function validateRefreshToken(token) {
  try {
    return jwt.verify(token, jwtConfig.secret.refresh);
  } catch (error) {
    return null;
  }
}