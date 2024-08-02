// @ts-check
'use strict';

import { todoService } from '../services/todo.service.js';
import { ApiError } from '../exceptions/api.error.js';

/**@typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodoItem */

export const todoController = {
  get,
  getById,
  post,
  put,
  patchById,
  removeMany,
  updateMany,
  patchBulkUnknown,
  remove,
};

/** @type {import('src/types/func.type.js').Middleware} */
async function get(req, res) {
  // console.info(`\napp.get('/todos')`);
  // query variables have 'undefined', 'string', 'string[]'
  const {
    page,
    size,
    userId,
    title,
    completed,
  } = req.query;

  if (['undefined', 'string'].every(option => option !== typeof title)) {
    throw ApiError.InvalidData(
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

  if (typeof page === 'undefined' || typeof size === 'undefined') {
    throw ApiError.InvalidData(`'page' and 'size' are required`);
  }

  const limit = parseInt(String(size), 10) || Number.MAX_SAFE_INTEGER;
  const offset = ((parseInt(String(page), 10) || 1) - 1) * limit;

  // console.info({
  //   userId,
  //   title,
  //   completed,
  //   limit,
  //   offset,
  // });

  const {
    rows,
    count,
  } = await todoService.getAllByOptions(
    {
      userId: typeof userId !== 'undefined'
        ? String(userId)
        : userId,
      title: typeof title !== 'undefined'
        ? String(title)
        : title,
      completed:
        typeof completed !== 'undefined'
          ? completed === 'true'
          : completed,
    },
    limit,
    offset,
  );

  res.send({
    count,
    content: rows.map(row => todoService.normalize(row.dataValues)),
  });
}

/** @type {import('src/types/func.type.js').Middleware} */
async function getById(req, res) {
  // console.info(`\napp.get('/todos/:id=${req.params.id}')`);
  const { id } = req.params;
  const todo = await todoService.getById(id);

  if (!todo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  res.send(todoService.normalize(todo.dataValues));
}

/** @type {import('src/types/func.type.js').Middleware} */
async function post(req, res) {
  // express.json() can parse types correctly
  const {
    userId,
    title,
    completed,
  } = req.body;

  if (!title || !userId
    || typeof userId !== 'string'
    || typeof title !== 'string'
  ) {
    throw ApiError.InvalidData(
      `Type error`,
      {
        expected: {
          userId: 'string',
          title: 'string',
          completed: 'undefined | boolean',
        },
        got: {
          userId: `${typeof userId}: ${userId}`,
          title: `${typeof title}: ${title}`,
          completed: `${typeof completed}: ${completed}`,
        },
      },
    );
  }

  // console.info(`{
  //       ${userId}:${typeof userId},
  //       ${title}:${typeof title},
  //       ${completed}:${typeof completed},
  //     }`);

  const todo = await todoService.create({
    userId,
    title,
    completed:
      typeof completed === 'boolean'
        ? completed
        : false,
  });

  res.status(201)
    .send(todoService.normalize(todo.dataValues));
}

/** @type {import('src/types/func.type.js').Middleware} */
async function put(req, res) {
  console.info(`app.put('/todos/:id=${req.params.id}')`);
  const { id } = req.params;
  const {
    userId,
    title,
    completed,
  } = req.body;

  if (!userId || !title
    || typeof userId !== 'string'
    || typeof title !== 'string'
    || typeof completed !== 'boolean'
  ) {
    throw ApiError.InvalidData(
      `Type error`,
      {
        expected: {
          userId: 'string',
          title: 'string',
          completed: 'boolean',
        },
        got: {
          userId: `${typeof userId}: ${userId}`,
          title: `${typeof title}: ${title}`,
          completed: `${typeof completed}: ${completed}`,
        }
      },
    );
  }

  const foundTodo = await todoService.getById(id);

  if (!foundTodo) {
    const todo = await todoService.create({
      userId,
      title,
      completed,
    });

    res.status(201)
      .send(todoService.normalize(todo.dataValues));

    return;
  }

  Object.assign(foundTodo, {
    ...foundTodo.dataValues,
    userId,
    title,
    completed,
  });

  res.send(todoService.normalize(
    (await foundTodo.save()).dataValues,
  ));
}

/** @type {import('src/types/func.type.js').Middleware} */
async function patchById(req, res) {// overwrites some fields except id
  console.info(`\napp.patch('/todos/:id=${req.params.id}')\n`);

  const { id } = req.params;

  const foundTodo = await todoService.getById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  // get updated values from req.body or use previous
  const {
    userId = foundTodo.dataValues.userId,
    title = foundTodo.dataValues.title,
    completed = foundTodo.dataValues.completed,
  } = req.body;

  const [affectedCount, affectedRows] = await todoService.updateById({
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
    todoService.normalize(affectedRows[0].dataValues)
  );
}

/** @type {import('src/types/func.type.js').Middleware} */
function patchBulkUnknown(req, res) {// overwrites some fields except id
  console.info(`\napp.patch('/todos?action=${req.query.action}')`);
  throw ApiError.NotFound(`action=${req.query.action} unknown`);
}

/** @type {import('src/types/func.type.js').Middleware} */
async function updateMany(req, res) {
  console.info(`\napp.patch('/todos?action=${req.query.action}')\n`);

  /**@type {{items: TyTodoItem[]}} */
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(422).send('Need { items: todo[] }');
    return;
  }

  (await todoService.updateManyById(items));

  res.sendStatus(204);
  return;
}

/** @type {import('src/types/func.type.js').Middleware} */
async function remove(req, res) {
  console.info(`\napp.delete('/todos/:id=${req.params.id}')\n`);
  const { id } = req.params;
  const foundTodo = await todoService.getById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  const count = await todoService.removeById(foundTodo.dataValues.id);

  res.status(200).send(`${count}`);
}

/** @type {import('src/types/func.type.js').Middleware} */
async function removeMany(req, res) {
  console.info(`\napp.patch('/todos?action=${req.query.action}')`);
  /**@type {{ids: string[]}} */
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    throw ApiError.InvalidData('Expected', {
      ids: 'string[]',
    });
  }

  const count = await todoService.removeManyById(ids);

  if (!count) {
    throw ApiError.NotFound();
  }

  res.status(202).send(`${count}`);
}
