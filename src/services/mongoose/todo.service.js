'use strict';
// @ts-check

import { Todo as Todos } from '../../models/mongoose/Todo.model.js';

/** 
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo
 * @typedef {import('src/types/todo.type.js').TyTodo.ItemPartial} TyTodoPartial
 * @typedef {import('src/types/todo.type.js').TyTodo.ItemNormalized} TyTodoNormalized 
 * @typedef {import('src/types/todo.type.js').TyTodo.ItemExtended} TyTodoExtended 
 * @typedef {import('src/types/todo.type.js').TyTodo.CreationAttributes} TyTodoCreationAttributes 
 * @typedef {import('src/types/db.type.js').TyMongoose.Query.Filter<TyTodo>} TyTodoFilterQuery
 */

export const todoService = {
  normalize,
  getAll,
  getAllByUser,
  getAndCountAllByOptions,
  getById,
  create,
  updateById,
  removeById,
};

/** 
 * @param {TyTodoExtended} param0
 * @returns {TyTodoNormalized} */
function normalize({
  id,
  userId,
  title,
  completed,
  createdAt,
  updatedAt,
}) {
  return {
    id,
    userId,
    title,
    completed,
    createdAt,
    updatedAt,
  };
}

function getAll() {
  const query = Todos.find();

  return query.sort({ id: 'asc' }).exec();
}

/**
 * @param {TyTodoPartial} param0
 * @param {number} limit
 * @param {number} offset */
async function getAndCountAllByOptions(
  {
    userId,
    title,
    completed,
  },
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
) {
  /** @type {TyTodoFilterQuery} */
  const whereConditions = {};

  if (userId !== undefined) {
    whereConditions.userId = userId;
  }

  if (title !== undefined) {
    whereConditions.title = new RegExp(title, 'i');;
  }

  if (completed !== undefined) {
    whereConditions.completed = completed;
  }

  const query
    = Todos.find(whereConditions);

  const rows = await query.limit(limit).skip(offset).exec();
  const count = await query.countDocuments().exec();

  return {
    rows,
    count,
  };
}

/**
 * @param {string} userId 
 * @returns */
function getAllByUser(userId) {
  const query = Todos.find({ userId });

  return query.sort({ createdAt: 'asc' }).exec();
}

/**
 * @param {string} id
 * @returns */
function getById(id) {
  const query = Todos.findOne({ id });

  return query.exec();
}

/**
 * @param {TyTodoCreationAttributes} properties 
 * @returns */
function create(properties) {
  return Todos.create({ ...properties });
}

/**
 * @param {TyTodoPartial} updatedTodo
 * @param {import('sequelize').Transaction | null | undefined} [transaction] */
function updateById(updatedTodo, transaction) {
  const { id, ...restProps } = updatedTodo;
  return Todos.update({
    ...restProps,
  }, {
    where: { id },
    returning: true, // The first element is always the number of affected rows, while the second element is the actual affected rows (only supported in postgres and mssql)
    transaction,
  });
}

/** @param {TyTodo['id']} id */
function removeById(id) {
  const query = Todos.findOne({ id });

  return query.deleteOne().exec();
}
