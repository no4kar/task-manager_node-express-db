'use strict';
// @ts-check

import { Op } from 'sequelize';
import Tasks from '#models/sequelize/Task.js';

/**
 * @typedef {import('src/types/task.type.js').TyTask.Item} TyTask
 * @typedef {import('src/types/task.type.js').TyTask.GetParams} TyTaskGetParams
 * @typedef {import('src/types/task.type.js').TyTask.UpdateParams} TyTaskUpdateParams
 * @typedef {import('src/types/task.type.js').TyTask.Normalized} TyTaskNormalized
 * @typedef {import('src/types/task.type.js').TyTask.Extended} TyTaskExtended
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyTask,TyTaskCreationAttributes>} TyTaskModel
 * @typedef {import('src/types/db.type.js').TySequelize.Query.WhereOptions<TyTask>} TyTaskWhereOptions
 * @typedef {import('src/types/task.type.js').TyTask.CreationAttributes} TyTaskCreationAttributes
*/

export default {
  create,
  getByOptions,
  getOneByOptions,
  getAndCountByOptions,
  getOneById,
  getByUserId,
  update,
  remove,
  removeById,
  removeByIds,

  normalize,
  toObject,
  prepareToSend,
  getValue,
};

/** 
 * @param {TyTaskExtended} param0
 * @returns {TyTaskNormalized} */
function normalize({
  id,
  userId,
  name,
  createdAt,
  updatedAt,
}) {
  return {
    id,
    userId,
    name,
    createdAt,
    updatedAt,
  };
}

/**
 * @param {TyTaskModel} model 
 * @returns {TyTask} */
function toObject(model) {
  return model.dataValues;
}

/**
 * @param {TyTaskModel} model 
 * @returns {TyTaskNormalized} */
function prepareToSend(model) {
  return normalize(toObject(model))
}

/**
 * Extracts a field value from a Sequelize document.
 * @template {keyof TyTask} K
 * @param {TyTaskModel} model
 * @param {K} key
 * @returns {TyTask[K]} */
function getValue(model, key) {
  return model.getDataValue(key);
}

/**
 * @param {TyTaskCreationAttributes} properties
 * @returns {Promise<TyTaskModel>} */
async function create(properties) {
  return Tasks.create(properties);
}

/**
 * @param {TyTaskModel} model
 * @param {TyTaskUpdateParams} properties
 * @returns {Promise<TyTaskModel>} */
function update(model, properties) {
  return model.set(properties).save();
}

/**
 * @param {TyTask['id']} id
 * @returns {Promise<TyTaskModel | null>} */
function getOneById(id) {
  return Tasks.findByPk(id);
}

/**
 * @param {TyTaskWhereOptions} whereConditions
 * @returns {Promise<TyTaskModel | null>} */
function getOneByOptions(whereConditions) {
  return Tasks.findOne({
    where: whereConditions,
  });
}

/**
 * @param {TyTaskWhereOptions} whereConditions
 * @returns {Promise<Array<TyTaskModel>>} */
function getByOptions(whereConditions) {
  return Tasks.findAll({
    where: whereConditions,
  });
}

/**
 * @param {TyTaskGetParams} getParams
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<{ rows: Array<TyTaskModel>; count: number;}>} */
async function getAndCountByOptions(
  getParams,
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
) {
  /**@type {TyTaskWhereOptions} */
  const whereOptions = {};

  if (getParams.userId !== undefined) {
    whereOptions.userId
      = getParams.userId;
  }

  if (getParams.name) {
    whereOptions.name = {
      [Op.like]: `%${getParams.name}%`,
    };
  }

  return Tasks.findAndCountAll({
    where: whereOptions,
    limit,
    offset,
  })
}

/**
 * @param {TyTask['userId']} userId
 * @returns {Promise<Array<TyTaskModel>>} */
function getByUserId(userId) {
  return Tasks.findAll({
    where: { userId },
  });
}

/**
 * @param {TyTaskModel} model
 * @returns {Promise<number>} */
function remove(model) {
  return model.destroy()
    .then(() => 1);
}

/**
 * @param {TyTask['id']} id
 * @returns {Promise<number>} */
function removeById(id) {
  return Tasks.destroy({
    where: { id },
  });
}

/** @param {string[]} ids */
function removeByIds(ids) {
  return Tasks.destroy({
    where: {
      id: { [Op.in]: ids },
    }
  });
}
