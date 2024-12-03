'use strict';
// @ts-check


/**
 * @typedef {import('src/types/func.type.js').TyFunc.Middleware} TyFuncMiddleware
 * @typedef {import('../services/mongoose/task.service.js').TyTaskFilterQuery} TyTaskFilterQuery
 */

import { ApiError } from 'src/exceptions/api.error.js';
import { taskService } from '../services/mongoose/task.service.js';

export const taskController = {
  get,
  getById,
};

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function getById(req, res) {
  const { id } = req.params;
  const task
    = await taskService.getOneById(id);

  if (!task) {
    throw ApiError.NotFound(
      `Can't find task by id`,
    );
  }

  res.send(taskService.normalize(taskService.toObject(task)));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function get(req, res) {
  const {
    page,
    size,
    userId,
    name,
  } = req.query;

  const errors = {
    userId: !userId || typeof userId !== 'string',
    name: !name || typeof name !== 'string',
    page: !page || typeof page !== 'number',
    size: !size || typeof size !== 'number',
  };

  if (errors.page || errors.size) {
    throw ApiError.UnprocessableContent(
      `'page' and 'size' are required`,
      { details: { page, size } }
    );
  }

  const limit
    = parseInt(String(size), 10) || Number.MAX_SAFE_INTEGER;
  const offset
    = ((parseInt(String(page), 10) || 1) - 1) * limit;

  /** @type {TyTaskFilterQuery} */
  const whereConditions = {};

  if (!errors.userId) {
    whereConditions.userId = userId;
  }

  if (!errors.name) {
    whereConditions.taskId = name;
  }

  const {
    rows,
    count,
  } = await taskService.getAndCountByOptions(
    whereConditions,
    limit,
    offset,
  );

  res.send({
    count,
    content: rows.map(row =>
      taskService.normalize(taskService.toObject(row))),
  });
}

// // By ID
// app.get('/tasks/:id', async (req, res) => {
//   const { id } = req.params;
//   const task = await taskService.getById(id);
//   if (!task) return res.status(404).send({ error: 'Task not found' });
//   res.send(task);
// });

// // By search parameters
// app.get('/tasks', async (req, res) => {
//   const { userId, name } = req.query;
//   const tasks = await taskService.getByOptions({ userId, name });
//   res.send(tasks);
// });
