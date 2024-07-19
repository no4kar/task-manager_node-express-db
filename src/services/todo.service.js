'use strict';
// @ts-check

import { Op } from 'sequelize';
import { sequelize } from '../store/sqlite.db.js';
import { Todo as Todos } from '../models/Todo.model.js';

/**@typedef {import('../types/todo.type.js').TyTodo.Item} TyTodoItem */
/**@typedef {import('../types/todo.type.js').TyTodo.ItemPartial} TyTodoItemPartial */
/**@typedef {import('../types/todo.type.js').TyTodo.Model} TyTodoModel */

export {
  normalize,
  getAll,
  getAllByUser,
  getAllByOptions,
  getById,
  create,
  updateById,
  updateManyById,
  removeById,
  removeManyById,
  findMatchProps,
  findManyMatchProps,
};

/**@param {Object} item */
function normalize(item) {
  return item;
}

function getAll() {
  return Todos.findAll({
    order: ['id'],
  });
}

/**
 * @param {TyTodoItemPartial} itemPartial
 * @param {number} [limit]
 * @param {number} [offset]
 */
function getAllByOptions(
  {
    userId,
    title,
    completed,
  },
  limit,
  offset,
) {
  /**@type {import('sequelize').WhereOptions<TyTodoItem>} */
  const whereConditions = {};

  if (userId !== undefined) {
    whereConditions.userId = userId;
  }

  if (title !== undefined) {
    whereConditions.title = {
      [Op.like]: `%${title}%`,
    };
  }

  if (completed !== undefined) {
    whereConditions.completed = completed;
  }

  console.info(whereConditions);

  return Todos.findAndCountAll({
    where: whereConditions,
    limit,
    offset,
  });
}

/**
 * @param {string} userId */
function getAllByUser(userId) {
  return Todos.findAll({
    where: {
      userId,
    }
  });
}

/**
 * @param {string} id */
function getById(id) {
  return Todos.findOne({
    where: {
      id,
    }
  });
}

/**
 * @param {import('../types/todo.type.js').TyTodo.CreationAttributes} properties */
function create(properties) {
  return Todos.create({ ...properties });
  // return Todos.create(
  //   { ...properties },
  //   { fields: ['userId', 'title', 'completed'] });
}

/**
 * @param {TyTodoItem} newTodo
 * @param {import('sequelize').Transaction | null | undefined} [transaction]
*/
function updateById(newTodo, transaction) {
  const { id, ...restProps } = newTodo;
  return Todos.update({
    ...restProps,
  }, {
    where: { id },
    returning: true, // The first element is always the number of affected rows, while the second element is the actual affected rows (only supported in postgres and mssql)
    transaction,
  });
}

/**
 * @param {TyTodoItem[]} items*/
async function updateManyById(items) {
  return sequelize.transaction(async (t) => { // eslint-disable-line
    /**@type {(TyTodoItem | null)[]} */
    const results = [];

    for (const item of items) {
      const [, affectedRows] = (await updateById(item, t));
      results.push(...(affectedRows.map(ar => ar.dataValues)));
    }

    return results;
  });
}

/** @param {TyTodoItem['id']} id */
function removeById(id) {
  return Todos.destroy({
    where: { id },
  });
}

/** @param {string[]} ids */
function removeManyById(ids) {
  return Todos.destroy({
    where: {
      id: { [Op.in]: ids },
    },
  });
}

/**
 * @param {object} targetObj
 * @param {object} sourceObj */
function findMatchProps(targetObj, sourceObj) {
  const result = {};

  for (const [targetKey, targetValue] of Object.entries(targetObj)) {
    if (!(targetKey in sourceObj)
      || typeof targetValue !== typeof sourceObj[targetKey]) {
      continue;
    }

    result[targetKey] = sourceObj[targetKey];
  }

  return Object.keys(result).length ? result : null;
}

/**
 * @param {object} targetObj
 * @param {object[]} sourceObjs */
function findManyMatchProps(targetObj, sourceObjs) {
  return sourceObjs.map(compareObj => findMatchProps(targetObj, compareObj));
}
