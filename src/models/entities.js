'use strict';
// @ts-check

/**
 * @typedef {import('src/types/db.type.js').TyDb.IdentifiersMap} TyDbIdentifiersMap
 */

/** @type {TyDbIdentifiersMap} */
export const DB_IDENTIFIERS = Object.freeze({
  USER: {
    model: 'User',
    table: 'users',
  },
  TOKEN: {
    model: 'Token',
    table: 'tokens',
  },
  TODO: {
    model: 'Todo',
    table: 'todos',
  },
  TASK: {
    model: 'Task',
    table: 'tasks',
  },
});
