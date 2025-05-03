'use strict';
// @ts-check

import * as Helpers from '../utils/helpers.js';
import { todoService as tdSrv } from '../services/todo.service.js';
import { ApiError } from '../exceptions/apiError.js';

/** 
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodoItem
 * */

/**
 * @template {string} T1
 * @typedef {import('src/types/error.type.js').TyError.FailedReport<T1>} TyFailedReport
 */

export const todoController = {
  get,
  getById,
  post,
  put,
  patchById,
  remove,
  removeMany,
  updateMany,
  patchBulkUnknown,
};

/**
 * Extracts a field value from a Mongoose document.
 * @param {keyof { string: string, boolean: boolean, number: number}} another
 * @param {unknown} val
 * @returns {boolean} */
function undefOr(another, val) {
  const typeoVal = typeof val;
  return typeoVal === 'undefined'
    || typeoVal === another;
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function get(req, res) {
  // console.info(`\napp.get('/todos')`);
  // query variables have 'undefined', 'string', 'string[]'
  const {
    userId,
    taskId,
    title,
    completed,
  } = req.query;

  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 10;

  /** @type {TyFailedReport<'userId' | 'taskId' | 'title' | 'completed' | 'page' | 'size'>} */
  const errors = {
    userId: {
      isInvalid: !undefOr('string', userId),
      expected: 'string',
      got: typeof userId,
    },
    taskId: {
      isInvalid: !undefOr('string', taskId),
      expected: 'string',
      got: typeof taskId,
    },
    title: {
      isInvalid: !undefOr('string', title),
      expected: 'string',
      got: typeof title,
    },
    completed: {
      isInvalid: !undefOr('boolean', Boolean(completed)),
      expected: 'boolean',
      got: typeof Boolean(completed),
    },
    page: {
      isInvalid: !Helpers.isNatural(page),
      expected: 'natural number',
      got: typeof page,
    },
    size: {
      isInvalid: !Helpers.isNatural(size),
      expected: 'natural number',
      got: typeof size,
    },
  };

  if (errors.page.isInvalid
    || errors.size.isInvalid
    || errors.userId.isInvalid
    || errors.taskId.isInvalid
    || errors.title.isInvalid
    || errors.completed.isInvalid
  ) {
    throw ApiError.FailedReport(errors, 'Type error');
  }

  const limit
    = size;
  const offset
    = (page - 1) * size;

  const {
    rows,
    count: total,
  } = await tdSrv.getAndCountByOptions(
    req.query,
    limit,
    offset,
  );

  res.send({
    total,
    content: rows.map(row =>
      tdSrv.prepareToSend(row)),
    limit,
    offset,
  });
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function getById(req, res) {
  // console.info(`\napp.get('/todos/:id=${req.params.id}')`);
  const { id } = req.params;
  const todo = await tdSrv.getById(id);

  if (!todo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  res.send(tdSrv.prepareToSend(todo));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function post(req, res) {
  // express.json() can parse types correctly
  const {
    userId,
    taskId,
    title,
    completed,
  } = req.body;

  const errors = {
    userId: !userId || typeof userId !== 'string',
    taskId: !taskId || typeof userId !== 'string',
    title: !title || typeof title !== 'string',
  };

  if (errors.userId || errors.taskId || errors.title) {
    throw ApiError.UnprocessableContent(
      `Type error`,
      {
        expected: {
          userId: 'string',
          taskId: 'string',
          title: 'string',
          completed: 'undefined | boolean',
        },
        got: {
          userId: `${typeof userId}: ${userId}`,
          taskId: `${typeof taskId}: ${taskId}`,
          title: `${typeof title}: ${title}`,
          completed: `${typeof completed}: ${completed}`,
        },
      },
    );
  }

  const todo
    = await tdSrv.create({
      userId,
      taskId,
      title,
      completed:
        typeof completed === 'boolean'
          ? completed
          : false,
    });

  res.status(201)
    .send(tdSrv.prepareToSend(todo));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function put(req, res) {
  const { id } = req.params;
  const {
    userId,
    taskId,
    title,
    completed,
  } = req.body;

  const errors = {
    id: !id || typeof id !== 'string',
    userId: !userId || typeof userId !== 'string',
    taskId: !taskId || typeof userId !== 'string',
    title: !title || typeof title !== 'string',
    completed: typeof completed !== 'boolean',
  };

  // if no id then no foundTodo
  const foundTodo = await tdSrv.getById(id);

  if (!foundTodo) {
    if (errors.userId
      || errors.taskId
      || errors.title
      || errors.completed) {
      throw ApiError.UnprocessableContent(
        `Type error`,
        {
          expected: {
            userId: 'string',
            taskId: 'string',
            title: 'string',
            completed: 'boolean',
          },
          got: {
            userId: `${typeof userId}: ${userId}`,
            taskId: `${typeof taskId}: ${taskId}`,
            title: `${typeof title}: ${title}`,
            completed: `${typeof completed}: ${completed}`,
          }
        },
      );
    }

    const createdTodo = await tdSrv.create({
      userId,
      taskId,
      title,
      completed,
    });

    res.status(201)
      .send(tdSrv.prepareToSend(createdTodo));

    return;
  }

  await tdSrv.update(
    foundTodo,
    { title, completed },
  );

  res.send(tdSrv.prepareToSend(foundTodo));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function patchById(req, res) {// overwrites some fields except id
  const { id } = req.params;

  const foundTodo
    = await tdSrv.getById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(`Can't find todo by id=${id}`);
  }

  // get updated values from req.body or use previous
  const {
    userId = tdSrv.getValue(foundTodo, 'userId'),
    title = tdSrv.getValue(foundTodo, 'title'),
    completed = tdSrv.getValue(foundTodo, 'completed'),
  } = req.body;

  const [
    affectedCount,
    affectedRows,
  ] = await tdSrv.updateById({
    id,
    userId,
    title,
    completed,
  });

  // error will be capture by errorMiddleware
  if (affectedCount !== 1) {
    throw ApiError.BadRequest(
      'Something went wrong',
      {
        affectedCount,
      });
  }

  res.send(
    tdSrv.prepareToSend(affectedRows[0])
  );
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
function patchBulkUnknown(req) {// overwrites some fields except id
  throw ApiError.NotFound(`action=${req.query.action} unknown`);
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function updateMany(req, res) {
  /**@type {{items: TyTodoItem[]}} */
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(422).send('Need { items: todo[] }');
    return;
  }

  await tdSrv.updateManyById(items);

  res.sendStatus(204);
  return;
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function remove(req, res) {
  const { id } = req.params;
  const foundTodo = await tdSrv.getById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(
      `Cant find todo by the id`,
      { id },
    );
  }

  const count
    = await tdSrv.remove(foundTodo);

  res.status(200).send(`${count}`);
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function removeMany(req, res) {
  /**@type {{ids: string[]}} */
  const { ids } = req.body;

  const errors = {
    ids: !Array.isArray(ids) || typeof ids[0] !== 'string',
  };

  if (errors.ids) {
    throw ApiError.UnprocessableContent(
      'Type error',
      {
        expected: {
          ids: 'string[]',
        },
        got: {
          ids: `${typeof ids}: ${ids}`,
        },
      });
  }

  const count
    = await tdSrv.removeByIds(ids);

  if (!count) {
    throw ApiError.NotFound();
  }

  res.status(202).send(`${count}`);
}
