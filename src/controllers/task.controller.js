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
  post,
  put,
  remove,
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
    whereConditions.name = name;
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

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function post(req, res) {
  const {
    userId,
    name,
  } = req.body;

  const errors = {
    userId: !userId || typeof userId !== 'string',
    name: !name || typeof name !== 'string',
  };

  if (errors.userId || errors.name) {
    throw ApiError.UnprocessableContent(
      `Can't create the task`,
      {
        expected: {
          userId: 'string',
          name: 'string',
        },
        got: {
          userId: `${typeof userId}: ${userId}`,
          name: `${typeof name}: ${name}`,
        },
      },
    );
  }

  const createdTask
    = await taskService.create({
      userId,
      name,
    });

  res.status(201)
    .send(taskService.normalize(createdTask.toObject()));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function put(req, res) {
  const { id } = req.params;
  const {
    userId,
    name,
  } = req.body;

  const errors = {
    userId: !userId || typeof userId !== 'string',
    name: !name || typeof name !== 'string',
  };

  // if no id then no foundTodo
  const foundTask = await taskService.getOneById(id);

  if (!foundTask) {
    if (errors.userId
      || errors.name) {
      throw ApiError.UnprocessableContent(
        `Type error`,
        {
          expected: {
            userId: 'string',
            name: 'string',
          },
          got: {
            userId: `${typeof userId}: ${userId}`,
            name: `${typeof name}: ${name}`,
          }
        },
      );
    }

    const createdTask
      = await taskService.create({
        userId,
        name,
      });

    res.status(201)
      .send(taskService.normalize(createdTask.toObject()));

    return;
  }

  await taskService.update(
    foundTask,
    { userId, name },
  );

  res.send(taskService.normalize(
    foundTask.toObject(),
  ));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function remove(req, res) {
  const { id } = req.params;
  const foundTodo = await taskService.getOneById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  const count
    = await taskService.remove(foundTodo);

  res.status(200).send(`${count}`);
}
