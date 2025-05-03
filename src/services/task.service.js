'use strict';
// @ts-check

export const taskService
  = (await import('./mongoose/task.js')).default;
