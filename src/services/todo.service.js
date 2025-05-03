'use strict';
// @ts-check

export const todoService
  = (await import('./mongoose/todo.js')).default;
