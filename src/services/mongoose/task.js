'use strict';
// @ts-check

import Tasks from '#models/mongoose/Task.js';

/**
 * @typedef {import('src/types/task.type.js').TyTask.Item} TyTask
 * @typedef {import('src/types/task.type.js').TyTask.GetParams} TyTaskGetParams
 * @typedef {import('src/types/task.type.js').TyTask.UpdateParams} TyTaskUpdateParams
 * @typedef {import('src/types/task.type.js').TyTask.Normalized} TyTaskNormalized
 * @typedef {import('src/types/task.type.js').TyTask.Extended} TyTaskExtended
 * @typedef {import('src/types/db.type.js').TyMongoose.Document<unknown,{},TyTask>} TyTaskDocument
 * @typedef {import('src/types/db.type.js').TyMongoose.Query.Filter<TyTask>} TyTaskFilterQuery
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
 * @param {TyTaskDocument} document 
 * @returns {TyTask} */
function toObject(document) {
  return document.toObject();
}

/**
 * @param {TyTaskDocument} document 
 * @returns {TyTaskNormalized} */
function prepareToSend(document) {
  return normalize(toObject(document))
}

/**
 * Extracts a field value from a Mongoose document.
 * @template {keyof TyTask} K
 * @param {TyTaskDocument} document
 * @param {K} key
 * @returns {TyTask[K]} */
function getValue(document, key) {
  return document.get(key);
}

/**
 * @param {TyTaskCreationAttributes} properties
 * @returns {Promise<TyTaskDocument>} */
async function create(properties) {
  return Tasks.create(properties);
}

/**
 * @param {TyTaskDocument} document
 * @param {TyTaskUpdateParams} properties
 * @returns {Promise<TyTaskDocument>} */
function update(document, properties) {
  return document.set(properties).save();
}

/**
 * @param {TyTask['id']} id
 * @returns {Promise<TyTaskDocument | null>} */
function getOneById(id) {
  const query = Tasks.findById(id);

  return query.exec();
}

/**
 * @param {TyTaskFilterQuery} whereConditions
 * @returns {Promise<TyTaskDocument | null>} */
function getOneByOptions(whereConditions) {
  const query = Tasks.findOne(whereConditions);

  return query.exec();
}

/**
 * @param {TyTaskFilterQuery} whereConditions
 * @returns {Promise<Array<TyTaskDocument>>} */
function getByOptions(whereConditions) {
  const query = Tasks.find(whereConditions);

  return query.exec();
}

/**
 * @param {TyTaskGetParams} getParams
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<{ rows: Array<TyTaskDocument>; count: number;}>} */
async function getAndCountByOptions(
  getParams,
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
) {
  /** @type { TyTaskFilterQuery } */
  const whereConditions = {};

  if (getParams.userId) {
    whereConditions.userId
      = getParams.userId;
  }

  if (getParams.name) {
    whereConditions.title
      = new RegExp(getParams.name, 'i');
  }

  return {
    rows:
      await Tasks.find(whereConditions)
        .limit(limit)
        .skip(offset)
        .exec(),
    count:
      await Tasks.find(whereConditions)
        .countDocuments()
        .exec(),
  };
}

/**
 * @param {TyTask['userId']} userId
 * @returns {Promise<Array<TyTaskDocument>>} */
function getByUserId(userId) {
  const query
    = Tasks.find({ userId });

  return query.exec();
}

/**
 * @param {TyTaskDocument} document
 * @returns {Promise<number>} */
function remove(document) {
  return document.deleteOne()
    .then(res => res.deletedCount);
}

/**
 * @param {TyTask['id']} id
 * @returns {Promise<number>} */
function removeById(id) {
  const query
    = Tasks.findById(id);

  // @returns {Promise<{ acknowledged: boolean, deletedCount: number }>}

  return query.deleteOne().exec()
    .then(res => res.deletedCount);
}
