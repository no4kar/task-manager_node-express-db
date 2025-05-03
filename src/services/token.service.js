'use strict';
// @ts-check

export const tokenService
  = (await import('./mongoose/token.js')).default;;
