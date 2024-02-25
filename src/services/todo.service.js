import { Op } from 'sequelize';
import { sequelize } from '../store/sqlite.db.js';

import {Todo as Todos} from '../models/Todo.model.js';

/** @typedef {import('../types/todo.type.js').Todo} Todo */

export function getAll() {
  return Todos.findAll({
    order: ['id'],
  });
}

/**
 * @param {number} userId
 * @returns { Promise<Todo[]> } */
export function getAllByUser(userId) {
  return Todos.findAll({
    where: {
      userId,
    }
  });
}

/**
 * @param {string} id
 * @returns { Promise<Todo | null> } */
export function getById(id) {
  return Todos.findOne({
    where: {
      id,
    }
  });
}

/**
 * @param {Object} properties
 * @returns {Promise<Todo | null>}*/
export function create(properties) {
  return Todos.create(
    { ...properties },
    { fields: ['userId', 'title'] });
}

/**
 * @param {Todo} newTodo 
 * @returns {Promise<Todo | null>} */
export function updateById(newTodo, transaction) {
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
 * @param {Todo[]} items*/
export async function updateManyById(items) {
  return sequelize.transaction(async (t) => { // eslint-disable-line
    /**@type {Todo[]} */
    const results = [];

    for (const item of items) {
      results.push(await updateById(item, t));
    }

    return results;
  });
}

/** @param {string} id */
export function removeById(id) {
  return Todos.destroy({
    where: { id },
  });
}

/** @param {string[]} ids */
export function removeManyById(ids) {
  return Todos.destroy({
    where: {
      id: { [Op.in]: ids },
    },
  });
}

/**
 * @param {object} targetObj
 * @param {object} sourceObj */
export function findMatchProps(targetObj, sourceObj) {
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
export function findManyMatchProps(targetObj, sourceObjs) {
  return sourceObjs.map(compareObj => findMatchProps(targetObj, compareObj));
}
