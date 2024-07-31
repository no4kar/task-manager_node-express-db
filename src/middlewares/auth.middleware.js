// @ts-check
'use strict';

import { ApiError } from '../exceptions/api.error.js';

import * as jwtService from '../services/jwt.service.js';

/** @type {import('../types/func.type.js').Middleware} */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    throw ApiError.Unauthorized();
  }

  const [, accessToken] = authHeader.split(' ');

  if (!accessToken) {
    throw ApiError.Unauthorized();
  }

  const userData = jwtService.validateAccessToken(accessToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  next();
}
