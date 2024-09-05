'use strict';
// @ts-check

import { Op } from 'sequelize';
import { sequelize } from '../../store/sqlite.db.js';
import { Todo as Todos } from '../../models/sequelize/Todo.model.js';

/**@typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo */
/**@typedef {import('src/types/todo.type.js').TyTodo.ItemPartial} TyTodoPartial */
/**@typedef {import('src/types/todo.type.js').TyTodo.Model} TyTodoModel */

export const todoService = {
  normalize,
  getAll,
  getAllByUser,
  getAndCountAllByOptions,
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
    order: [['id', 'ASC']],
  });
}

/**
 * @param {TyTodoPartial} itemPartial
 * @param {number} [limit]
 * @param {number} [offset] */
function getAndCountAllByOptions(
  {
    userId,
    title,
    completed,
  },
  limit,
  offset,
) {
  /**@type {import('sequelize').WhereOptions<TyTodo>} */
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
 * @param {import('src/types/todo.type.js').TyTodo.CreationAttributes} properties */
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

/**
 * @param {TyTodo[]} items*/
async function updateManyById(items) {
  return sequelize.transaction(async (t) => { // eslint-disable-line
    /**@type {(TyTodo | null)[]} */
    const results = [];

    for (const item of items) {
      const [, affectedRows] = (await updateById(item, t));
      results.push(...(affectedRows.map(ar => ar.dataValues)));
    }

    return results;
  });
}

/** @param {TyTodo['id']} id */
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
