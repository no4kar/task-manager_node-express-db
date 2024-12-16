'use strict';
// @ts-check

import * as Helpers from '../utils/helpers.js';
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
    userId,
    taskId,
    title,
    completed,
  } = req.query;

  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 10;

  const errors = {
    userId: !userId,
    taskId: !taskId,
    title: !title,
    completed: !completed,
    page: !Helpers.isNatural(page),
    size: !Helpers.isNatural(size),
  };

  if (errors.page || errors.size) {
    throw ApiError.UnprocessableContent(
      `'page' and 'size' are required`,
      {
        expected: {
          page: 'integer',
          size: 'integer',
        },
        got: {
          page,
          size,
        },
      }
    );
  }

  const limit
    = size;
  const offset
    = (page - 1) * size;

  /** @type {import('../services/mongoose/todo.service.js').TyTodoFilterQuery} */
  const whereConditions = {};

  if (!errors.userId) {
    whereConditions.userId = String(userId);
  }

  if (!errors.taskId) {
    whereConditions.taskId = String(taskId);
  }

  if (!errors.title) {
    whereConditions.title = new RegExp(String(title), 'i');;
  }

  if (!errors.completed) {
    whereConditions.completed = completed === 'true';
  }

  const {
    rows,
    count: total,
  } = await todoService.getAndCountByOptions(
    whereConditions,
    limit,
    offset,
  );

  res.send({
    total,
    content: rows.map(row =>
      todoService.normalize(row.toObject())),
    limit,
    offset,
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
    throw ApiError.NotFound(
      `Cant find todo by the id`,
      { id },
    );
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
    = await todoService.removeManyById(ids);

  if (!count) {
    throw ApiError.NotFound();
  }

  res.status(202).send(`${count}`);
}
