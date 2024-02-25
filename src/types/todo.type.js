import { } from 'express';

/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} userId
 * @property {string} title
 * @property {boolean} completed
*/

/**
 * @callback TyFuncController
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @return {void | Promise<void>}
 */

/**
 * @callback TyFuncErrorMiddleware
 * @param {import('../exceptions/todo.error').ApiError} error
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @return {void | Promise<void>}
 */

/**
 * @callback TyFuncSendAuth
 * @param {import('express').Response} res
 * @param {import('sequelize').Model} user
 * @return {Promise<void>}
 */