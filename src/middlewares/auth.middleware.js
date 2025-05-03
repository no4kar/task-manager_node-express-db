'use strict';
import { env } from '../configs/env.config.js';
// @ts-check

import { ApiError } from '../exceptions/apiError.js';
import { jwtService as jwtSrv } from '../services/jwt.service.js';

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
function nopMiddleware(_unused_req, _unused_res, next) { next(); }

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
export const authMiddleware =
  env.flag.mode.includes('no-auth')
    ? nopMiddleware
    : (req, _unused_res, next) => {
      // Simplified check for Google authenticate
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
        = jwtSrv.validateAccessToken(accessToken);

      if (!userData) {
        throw ApiError.Unauthorized();
      }

      req.user = userData;

      next();
    };

// /** 
//  * @param {('admin' | 'manager' | 'foreman' | 'staff')} role
//  * @returns {import('src/types/func.type.js').TyFunc.Middleware} */
// export function authorize(role) {
//   return env.flag.mode.includes('no-roles')
//     ? nopMiddleware
//     : (req, res, next) => {
//       if (req?.user?.role === role) {
//         next();
//         return;
//       }

//       throw ApiError.Forbidden('You are not allowed to access');
//     };
// }
