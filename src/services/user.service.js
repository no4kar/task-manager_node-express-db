'use strict';
// @ts-check

export const userService
  = (await import('./mongoose/user.js')).default;
