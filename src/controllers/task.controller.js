'use strict';
// @ts-check

/**
 * @typedef {import('src/types/func.type.js').TyFunc.Middleware} TyFuncMiddleware
 * @typedef {import('src/services/mongoose/task.service.js').TyTaskFilterQuery} TyTaskFilterQuery
 * @typedef {import('src/types/error.type.js').TyError.CodeReport} TyErrorCodeReport
*/

/**
 * @template {string} T1
 * @typedef {import('src/types/error.type.js').TyError.FailedReport<T1>} TyFailedReport
 */

import { isNatural } from '../utils/helpers.js';
import { ApiError, checkUserIdOwnership } from '../exceptions/apiError.js';
import { taskService } from '../services/mongoose/task.service.js';
import { userService } from '../services/mongoose/user.service.js';

export const taskController = {
  get,
  getById,
  post,
  put,
  remove,
};

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function get(req, res) {
  const {
    userId,
    name,
  } = req.query; // ?userId=...&name=...&page=...&size=...

  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 10;

  /** @type {TyFailedReport<'userId' | 'name' | 'page' | 'size'>} */
  const errors = {
    userId: {
      isInvalid: !userId,
      expected: 'string',
      got: typeof userId,
    },
    name: {
      isInvalid: !name,
      expected: 'string',
      got: typeof name,
    },
    page: {
      isInvalid: !isNatural(page),
      expected: 'natural number',
      got: typeof page,
    },
    size: {
      isInvalid: !isNatural(size),
      expected: 'natural number',
      got: typeof size,
    },
  };

  if (errors.page.isInvalid
    || errors.size.isInvalid
    || errors.userId.isInvalid) {
    throw ApiError.FailedReport(errors, 'Type error');
  }

  checkUserIdOwnership(req?.user?.id, userId);

  const limit = size;
  const offset = (page - 1) * size;

  /** @type {TyTaskFilterQuery} */
  const whereConditions = { userId };

  if (!errors.name.isInvalid) {
    whereConditions.name = new RegExp(String(name), 'i');
  }

  const {
    rows,
    count: total,
  } = await taskService.getAndCountByOptions(
    whereConditions,
    limit,
    offset,
  );

  res.send({
    total,
    content: rows.map(row =>
      taskService.prepareToSend(row)),
    limit,
    offset,
  });
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function getById(req, res) {
  const { id } = req.params;
  const foundTask
    = await taskService.getOneById(id);

  if (!foundTask) {
    throw ApiError.NotFound(
      `Can't find task by id`,
    );
  }

  checkUserIdOwnership(req?.user?.id, foundTask.userId);

  res.send(taskService.prepareToSend(foundTask));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function post(req, res) {
  const {
    userId,
    name,
  } = req.body;

  /** @type {TyFailedReport<'userId' | 'name'>} */
  const errors = {
    userId: {
      isInvalid: !userId,
      expected: 'string',
      got: typeof userId,
    },
    name: {
      isInvalid: !name,
      expected: 'string',
      got: typeof name,
    },
  };

  if (errors.userId.isInvalid
    || errors.name.isInvalid) {
    throw ApiError.FailedReport(errors, 'Can\'t create the task');
  }

  checkUserIdOwnership(req?.user?.id, userId);

  const foundUser
    = await userService.getOneByOptions({ id: userId });

  if (!foundUser) {
    throw ApiError.NotFound(
      `Cant find user by the userId`,
      { userId },
    );
  }

  const createdTask
    = await taskService.create({
      userId,
      name,
    });

  res.status(201)
    .send(taskService.prepareToSend(createdTask));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function put(req, res) {
  const { id } = req.params;
  const {
    userId,
    name,
  } = req.body;

  /** @type {TyFailedReport<'userId' | 'name'>} */
  const errors = {
    userId: {
      isInvalid: !userId,
      expected: 'string',
      got: typeof userId,
    },
    name: {
      isInvalid: !name,
      expected: 'string',
      got: typeof name,
    },
  };

  const foundUser
    = await userService.getOneByOptions({ id: userId });

  if (!foundUser) {
    throw ApiError.NotFound(
      `Cant find user by the userId`,
      { userId },
    );
  }

  checkUserIdOwnership(req?.user?.id, foundUser.id);

  // if no id then no foundTask
  const foundTask
    = await taskService.getOneById(id);

  if (!foundTask) {
    if (errors.userId.isInvalid
      || errors.name.isInvalid) {
      throw ApiError.FailedReport(errors);
    }

    const createdTask
      = await taskService.create({
        userId,
        name,
      });

    res.status(201)
      .send(taskService.prepareToSend(createdTask));

    return;
  }

  checkUserIdOwnership(req?.user?.id, foundTask.userId);

  await taskService.update(
    foundTask,
    { userId, name },
  );

  res.send(taskService.prepareToSend(foundTask));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function remove(req, res) {
  const { id } = req.params;
  const foundTask
    = await taskService.getOneById(id);

  if (!foundTask) {
    throw ApiError.NotFound(
      `Cant find todo by the id`, {
      id,
    });
  }

  checkUserIdOwnership(req?.user?.id, foundTask.userId);

  const count
    = await taskService.remove(foundTask);

  res.status(200).send(`${count}`);
}
