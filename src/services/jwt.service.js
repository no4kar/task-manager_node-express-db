import jwt from 'jsonwebtoken';
import { jwt as jwtConfig } from '../config.js';

export const jwtService = {
  generateAccessToken,
  generateRefreshToken,
  validateAccessToken,
  validateRefreshToken,
};

function generateAccessToken(user) {
  return jwt.sign(user, jwtConfig.secret.access, { expiresIn: '5s' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, jwtConfig.secret.refresh, { expiresIn: '30s' });
}

function validateAccessToken(token) {
  try {
    return jwt.verify(token, jwtConfig.secret.access);
  } catch (error) {
    return null;
  }
}

function validateRefreshToken(token) {
  try {
    return jwt.verify(token, jwtConfig.secret.refresh);
  } catch (error) {
    return null;
  }
}