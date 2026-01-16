'use strict';
// @ts-check

export const imageService
  = (await import('./mongoose/image.js')).default;;
