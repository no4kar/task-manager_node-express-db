'use strict';
// @ts-check

import { Task as Tasks } from '../../models/mongoose/Task.model.js';

/**
 * @typedef {import('src/types/task.type.js').TyTask.Item} TyTask
 * @typedef {import('src/types/task.type.js').TyTask.GetParams} TyTaskGetParams
 * @typedef {import('src/types/task.type.js').TyTask.UpdateParams} TyTaskUpdateParams
 * @typedef {import('src/types/db.type.js').TyMongoose.Document<unknown,{},TyTask>} TyTaskDocument
 * @typedef {import('src/types/db.type.js').TyMongoose.Query.Filter<TyTask>} TyTaskFilterQuery
 * @typedef {import('src/types/task.type.js').TyTask.CreationAttributes} TyTaskCreationAttributes
*/

export const taskService = {
  create,
  getByOptions,
  getByUserId,
  getDataValue,
  update,
  put,
  remove,
};

/**
 * @param {TyTaskCreationAttributes} properties
 * @returns */
async function create(properties) {
  return Tasks.create(properties);
}

/**
 * @param {TyTaskDocument} document
 * @param {TyTaskUpdateParams} properties
 * @returns */
function update(document, properties) {
  return document.set(properties).save();
}

/**
 * @param {TyTaskCreationAttributes} properties
 * @returns */
async function put({
  userId,
  name,
}) {
  const query
    = Tasks.findOne({ userId });

  const foundTask = await query.exec();

  if (foundTask) {
    return foundTask.set({ name }).save();
  }

  return Tasks.create({ userId, name });
}

/**
 * @param {TyTaskFilterQuery} whereConditions
 * @returns */
function getByOptions(whereConditions) {
  const query = Tasks.findOne(whereConditions);

  return query.exec();
}

/**
 * @param {TyTaskDocument} document 
 * @returns */
function getDataValue(document) {
  return document.toObject();
}

/**
 * @param {TyTask['userId']} userId
 * @returns */
function getByUserId(userId) {
  const query
    = Tasks.findOne({ userId });

  return query.exec();
}

/**
 * @param {TyTask['userId']} userId
 * @returns {Promise<{ acknowledged: boolean, deletedCount: number }>}*/
function remove(userId) {
  const query
    = Tasks.findOne({ userId });

  return query.deleteOne().exec();
}
