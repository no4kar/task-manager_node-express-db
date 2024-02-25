import * as todoService from '../services/todo.service.js';
import { ApiError } from '../exceptions/todo.error.js';

/** @type {import('../types/todo.type.js').TyFuncController} */
export async function get(req, res) {
  console.info(`\napp.get('/todos')`);

  const { userId } = req.query;

  if (userId) {
    console.info(`\napp.get('/todos?userId=${userId}')`);
    const userTodos = await todoService.getAllByUser(userId);

    if (!userTodos.length) {
      throw ApiError.NotFound(`Cant find todos by userId=${userId}`);
    }

    res.send(userTodos);
    return;
  }

  res.send(await todoService.getAll());
}

/** @type {import('../types/todo.type.js').TyFuncController} */
export async function getById(req, res) {
  console.info(`\napp.get('/todos/:id=${req.params.id}')`);
  const { id } = req.params;
  const todo = await todoService.getById(id);

  if (!todo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  res.send(todo);
}

/** @type {import('../types/todo.type.js').TyFuncController} */
export async function post(req, res) {
  const { title, userId } = req.body;

  if (!title || !userId) {
    throw ApiError.InvalidData('Expected', {
      title: 'string',
      userId: 'string',
    });
  }

  const todo
    = await todoService.create({ userId, title });

  res.status(201)
    .send(todo);
}

/** @type {import('../types/todo.type.js').TyFuncController} */
export async function put(req, res) {// overwrites all fields except id
  console.info(`app.put(\'/todos/:id=${req.params.id}\')`);
  const { id } = req.params;
  const { title, userId, completed } = req.body;
  const foundTodo = await todoService.getById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  if (!title || !userId
    || typeof completed !== 'boolean') {
    throw ApiError.InvalidData('Expected', {
      title: 'string',
      userId: 'string',
      completed: 'boolean',
    });
  }

  await todoService.update({ id, userId, title, completed });

  res.send(await todoService.getById(id));
}

/** @type {import('../types/todo.type.js').TyFuncController} */
export async function patchById(req, res) {// overwrites some fields except id
  console.info(`\napp.patch(\'/todos/:id=${req.params.id}\')\n`);

  const { id } = req.params;
  const foundTodo = await todoService.getById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  const newTodo = todoService.findMatchProps(
    { userId: '1', title: '', completed: false },
    req.body);

  await todoService.updateById({ ...newTodo, id });
  res.send(await todoService.getById(id));// error will be capture by errorMiddleware
}

/** @type {import('../types/todo.type.js').TyFuncController} */
export function patchBulkUnknown(req, res) {// overwrites some fields except id
  console.info(`\napp.patch('/todos?action=${req.query.action}')`);
  throw ApiError.NotFound(`action=${req.query.action} unknown`);
}

/** @type {import('../types/todo.type.js').TyFuncController} */
export function updateMany(req, res) {
  console.info(`\napp.patch(\'/todos?action=${req.query.action}\')\n`);

  /**@type {{items: todoService.Todo[]}} */
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(422).send('Need { items: todo[] }');
    return;
  }

  try {
    const validatedItems
      = todoService
        .findMatchPropsMany(
          { id: '', userId: 1, title: '', completed: false }
          , items)
        .filter(item => item !== null);

    todoService.updateManyById(validatedItems);

  } catch (error) {
    res.status(500)
      .send(error);

    console.error(error);
  }

  res.sendStatus(204);
  return;
}

/** @type {import('../types/todo.type.js').TyFuncController} */
export async function remove(req, res) {
  console.info(`\napp.delete(\'/todos/:id=${req.params.id}\')\n`);
  const { id } = req.params;
  const foundTodo = await todoService.getById(id);

  if (!foundTodo) {
    throw ApiError.NotFound(`Cant find todo by id=${id}`);
  }

  const count = await todoService.removeById(foundTodo.id);

  res.status(202).send(`${count}`);
}

/** @type {import('../types/todo.type.js').TyFuncController} */
export async function removeMany(req, res) {
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
