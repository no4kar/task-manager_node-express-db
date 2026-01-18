'use strict';
// @ts-check

import { Op } from 'sequelize';
import { sequelize } from '#src/store/sequelize.db.js';
import Todos from '#models/sequelize/Todo.js';

/**
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo 
 * @typedef {import('src/types/todo.type.js').TyTodo.CreationAttributes} TyTodoCreationAttributes 
 * @typedef {import('src/types/todo.type.js').TyTodo.GetParams} TyTodoGetParams 
 * @typedef {import('src/types/todo.type.js').TyTodo.Extended} TyTodoExtended
 * @typedef {import('src/types/todo.type.js').TyTodo.Normalized} TyTodoNormalized 
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyTodo, TyTodoCreationAttributes>} TyTodoModel
 * @typedef {import('src/types/db.type.js').TySequelize.Query.WhereOptions<TyTodo>} TyTodoWhereOptions
 */

export default {
  create,
  getAll,
  getByUserId,
  getAndCountByOptions,
  getById,
  update,
  updateById,
  updateManyById,
  remove,
  removeById,
  removeByIds,

  normalize,
  toObject,
  prepareToSend,
  getValue,
};

/** 
 * @param {TyTodoExtended} item 
 * @returns {TyTodoNormalized} */
function normalize({
  id,
  userId,
  taskId,
  title,
  completed,
  createdAt,
  updatedAt,
}) {
  return {
    id,
    userId,
    taskId,
    title,
    completed,
    createdAt,
    updatedAt,
  };
}

/**
 * @param {TyTodoModel} model 
 * @returns {TyTodo} */
function toObject(model) {
  return model.dataValues;
}

/**
 * @param {TyTodoModel} model 
 * @returns */
function prepareToSend(model) {
  return normalize(toObject(model))
}

/**
 * Extracts a field value from a Sequelize document.
 * @template {keyof TyTodo} K
 * @param {TyTodoModel} model
 * @param {K} key
 * @returns {TyTodo[K]} */
function getValue(model, key) {
  return model.getDataValue(key);
}

function getAll() {
  return Todos.findAll({
    order: [['id', 'ASC']],
  });
}

/**
 * @param {TyTodoGetParams} getParams
 * @param {number} limit
 * @param {number} offset */
function getAndCountByOptions(
  getParams,
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
) {
  /**@type {TyTodoWhereOptions} */
  const whereOptions = {};

  if (getParams.userId !== undefined) {
    whereOptions.userId
      = getParams.userId;
  }

  if (getParams.taskId) {
    whereOptions.taskId
      = getParams.taskId;
  }

  if (getParams.title) {
    whereOptions.title = {
      [Op.like]: `%${getParams.title}%`,
    };
  }

  if (getParams.completed) {
    whereOptions.completed
      = getParams.completed;
  }

  return Todos.findAndCountAll({
    where: whereOptions,
    limit,
    offset,
  });
}

/**
 * @param {string} userId */
function getByUserId(userId) {
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
 * @param {TyTodoModel} model
 * @param {TyTodoGetParams} properties
 * @returns */
function update(model, properties) {
  return model.set(properties).save();
}

/**
 * @param {import('src/types/todo.type.js').TyTodo.CreationAttributes} properties */
function create(properties) {
  return Todos.create({ ...properties });
  // return Todos.create(
  //   { ...properties },
  //   { fields: ['userId', 'title', 'completed'] });
}

/**
 * @param {TyTodoGetParams} updatedTodo
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
  return sequelize.transaction(async (t) => {
    /**@type {(TyTodo | null)[]} */
    const results = [];

    for (const item of items) {
      const [, affectedRows] = (await updateById(item, t));
      results.push(...(affectedRows.map(ar => ar.dataValues)));
    }

    return results;
  });
}

/**
 * @param {TyTodoModel} model
 * @returns {Promise<number>} */
function remove(model) {
  return model.destroy()
    .then(() => 1);
}

/** @param {TyTodo['id']} id */
function removeById(id) {
  return Todos.destroy({
    where: { id },
  });
}

/** @param {string[]} ids */
function removeByIds(ids) {
  return Todos.destroy({
    where: {
      id: { [Op.in]: ids },
    },
  });
}
