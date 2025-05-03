'use strict';
// @ts-check

/**
 * @typedef {import('src/types/func.type.js').TyFunc.Middleware} TyFuncMiddleware
 * @typedef {import('src/types/error.type.js').TyError.CodeReport} TyErrorCodeReport
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUser
*/

/**
 * @template {string} T1
 * @typedef {import('src/types/error.type.js').TyError.FailedReport<T1>} TyFailedReport
 */

import { isNatural } from '../utils/helpers.js';
import { ApiError, checkUserIdOwnership as cuid } from '../exceptions/apiError.js';
import { taskService as tskSrv } from '../services/task.service.js';
import { userService as usrSrv } from '../services/user.service.js';
import { env } from '../configs/env.config.js';

const checkUserIdOwnership =
  env.flag.mode.includes('no-auth')
    ? () => { }
    : cuid;

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

  checkUserIdOwnership(
    /**@type {TyUser}*/(req.user).id,
    String(userId),
  );

  const limit = size;
  const offset = (page - 1) * size;

  /** @type {any} */
  const whereConditions
    = { userId };

  if (!errors.name.isInvalid) {
    whereConditions.name
      = new RegExp(String(name), 'i');
  }

  const {
    rows,
    count: total,
  } = await tskSrv.getAndCountByOptions(
    whereConditions,
    limit,
    offset,
  );

  res.send({
    total,
    content: rows.map(tskSrv.prepareToSend),
    limit,
    offset,
  });
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function getById(req, res) {
  const { id } = req.params;
  const foundTask
    = await tskSrv.getOneById(id);

  if (!foundTask) {
    throw ApiError.NotFound(
      `Can't find task by id`,
    );
  }

  checkUserIdOwnership(
    /**@type {TyUser}*/(req.user).id,
    tskSrv.getValue(foundTask, 'userId')
  );

  res.send(tskSrv.prepareToSend(foundTask));
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

  checkUserIdOwnership(
    /**@type {TyUser}*/(req.user).id,
    String(userId),
  );

  const foundUser
    = await usrSrv.getOneByOptions({ id: userId });

  if (!foundUser) {
    throw ApiError.NotFound(
      `Cant find user by the userId`,
      { userId },
    );
  }

  const createdTask
    = await tskSrv.create({
      userId,
      name,
    });

  res.status(201)
    .send(tskSrv.prepareToSend(createdTask));
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
    = await usrSrv.getOneByOptions({ id: userId });

  if (!foundUser) {
    throw ApiError.NotFound(
      `Cant find user by the userId`,
      { userId },
    );
  }

  checkUserIdOwnership(
    /**@type {TyUser}*/(req.user).id,
    usrSrv.getValue(foundUser, 'id')
  );

  const foundTask
    = await tskSrv.getOneById(id);

  if (!foundTask) {
    if (errors.userId.isInvalid
      || errors.name.isInvalid) {
      throw ApiError.FailedReport(errors);
    }

    const createdTask
      = await tskSrv.create({
        userId,
        name,
      });

    res.status(201)
      .send(tskSrv.prepareToSend(createdTask));

    return;
  }

  checkUserIdOwnership(
    /**@type {TyUser}*/(req.user).id,
    tskSrv.getValue(foundTask, 'userId'),
  );

  await tskSrv.update(
    foundTask,
    { userId, name },
  );

  res.send(tskSrv.prepareToSend(foundTask));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function remove(req, res) {
  const { id } = req.params;
  const foundTask
    = await tskSrv.getOneById(id);

  if (!foundTask) {
    throw ApiError.NotFound(
      `Cant find todo by the id`, {
      id,
    });
  }

  checkUserIdOwnership(
    /**@type {TyUser}*/(req.user).id,
    tskSrv.getValue(foundTask, 'userId'),
  );

  const count
    = await tskSrv.remove(foundTask);

  res.status(200).send(`${count}`);
}
