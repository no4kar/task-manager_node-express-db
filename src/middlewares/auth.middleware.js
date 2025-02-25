'use strict';
// @ts-check

import { checkUserIdOwnership } from '../utils/helpers.js';
import { ApiError } from '../exceptions/apiError.js';
import { jwtService } from '../services/jwt.service.js';

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
export function authMiddleware(req, res, next) {
  // Simplified check for Google authorization
  if (req.user) {
    next();
  }

  const authHeader
    = req.headers.authorization;

  if (!authHeader) {
    throw ApiError.Unauthorized();
  }

  const [,
    accessToken
  ] = authHeader.split(' ');

  if (!accessToken) {
    throw ApiError.Unauthorized();
  }

  const userData
    = jwtService.validateAccessToken(accessToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  req.user = userData;

  next();
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
export function checkUserIdOwnershipMiddleware(req, res, next) {
  if (typeof req.user.id === 'string') {
    checkUserIdOwnership(req.user.id, req.query.userId);
  } else {
    throw ApiError.UnprocessableContent(
      `Type error`,
      {
        expected: {
          userId: 'string',
        },
        got: {
          userId: `${typeof req.user.id}: ${userId}`,
        },
      },
    );
  }

  next();
}
