'use strict';
// @ts-check

import { todoService } from '../services/mongoose/todo.service.js';
import { ApiError } from '../exceptions/api.error.js';

/**@typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodoItem */

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

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function get(req, res) {
  // console.info(`\napp.get('/todos')`);
  // query variables have 'undefined', 'string', 'string[]'
  const {
    page,
    size,
    userId,
    taskId,
    title,
    completed,
  } = req.query;

  if (['undefined', 'string'].every(option => option !== typeof title)) {
    throw ApiError.UnprocessableContent(
      `Type error`, {
      expected: {
        title: 'undefined | string',
      },
      got: {
        title: `${typeof title}: ${title}`,
      }
    }
    );
  }

  if (typeof page === 'undefined'
    || typeof size === 'undefined') {
    throw ApiError.UnprocessableContent(`'page' and 'size' are required`);
  }

  const limit
    = parseInt(String(size), 10) || Number.MAX_SAFE_INTEGER;
  const offset
    = ((parseInt(String(page), 10) || 1) - 1) * limit;

  /** @type {import('../services/mongoose/todo.service.js').TyTodoFilterQuery} */
  const whereConditions = {};

  if (userId !== undefined) {
    whereConditions.userId = String(userId);
  }

  if (taskId !== undefined) {
    whereConditions.taskId = String(taskId);
  }

  if (title !== undefined) {
    whereConditions.title = new RegExp(String(title), 'i');;
  }

  if (completed !== undefined) {
    whereConditions.completed = completed === 'true';
  }

  const {
    rows,
    count,
  } = await todoService.getAndCountByOptions(
    whereConditions,
    limit,
    offset,
  );

  res.send({
    count,
    content: rows.map(row => todoService.normalize(row.toObject())),
  });
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function getById(req, res) {
  // console.info(`\napp.get('/todos/:id=${req.params.id}')`);
  const { id } = req.params;
  const todo = await todoService.getById(id);

  if (!todo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  res.send(todoService.normalize(todo.toObject()));
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
    = await todoService.create({
      userId,
      taskId,
      title,
      completed:
        typeof completed === 'boolean'
          ? completed
          : false,
    });

  res.status(201)
    .send(todoService.normalize(todo.toObject()));
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
  const foundTodo = await todoService.getById(id);

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

    const todo = await todoService.create({
      userId,
      taskId,
      title,
      completed,
    });

    res.status(201)
      .send(todoService.normalize(todo.toObject()));

    return;
  }

  await todoService.update(
    foundTodo,
    { title, completed },
  );

  res.send(todoService.normalize(
    foundTodo.toObject(),
  ));
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function patchById(req, res) {// overwrites some fields except id
  console.info(`\napp.patch('/todos/:id=${req.params.id}')\n`);

  const { id } = req.params;

  const foundTodo = await todoService.getById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(`Can't find todo by id=${id}`);
  }

  // get updated values from req.body or use previous
  const {
    userId = foundTodo.userId,
    title = foundTodo.title,
    completed = foundTodo.completed,
  } = req.body;


  const [
    affectedCount,
    affectedRows,
  ] = await todoService.updateById({
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
    todoService.normalize(affectedRows[0].toObject())
  );
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
function patchBulkUnknown(req, res) {// overwrites some fields except id
  console.info(`\napp.patch('/todos?action=${req.query.action}')`);
  throw ApiError.NotFound(`action=${req.query.action} unknown`);
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function updateMany(req, res) {
  console.info(`\napp.patch('/todos?action=${req.query.action}')\n`);

  /**@type {{items: TyTodoItem[]}} */
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(422).send('Need { items: todo[] }');
    return;
  }

  await todoService.updateManyById(items);

  res.sendStatus(204);
  return;
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function remove(req, res) {
  console.info(`\napp.delete('/todos/:id=${req.params.id}')\n`);
  const { id } = req.params;
  const foundTodo = await todoService.getById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  const count
    = await todoService.remove(foundTodo);

  res.status(200).send(`${count}`);
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function removeMany(req, res) {
  console.info(`\napp.patch('/todos?action=${req.query.action}')`);

  /**@type {{ids: string[]}} */
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    throw ApiError.UnprocessableContent('Expected', {
      ids: 'string[]',
    });
  }

  const count
    = await todoService.removeManyById(ids);

  if (!count) {
    throw ApiError.NotFound();
  }

  res.status(202).send(`${count}`);
}
