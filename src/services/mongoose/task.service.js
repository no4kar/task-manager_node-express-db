'use strict';
// @ts-check

import { Task as Tasks } from '../../models/mongoose/Task.model.js';

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

export const taskService = {
  normalize,
  toObject,
  prepareToSend,
  getByOptions,
  getOneByOptions,
  getAndCountByOptions,
  getOneById,
  getByUserId,
  create,
  update,
  remove,
  removeById,
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
 * @returns */
function prepareToSend(document){
  return normalize(toObject(document))
}

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
 * @param {TyTask['id']} id
 * @returns */
function getOneById(id) {
  const query = Tasks.findById(id);

  return query.exec();
}

/**
 * @param {TyTaskFilterQuery} whereConditions
 * @returns */
function getOneByOptions(whereConditions) {
  const query = Tasks.findOne(whereConditions);

  return query.exec();
}

/**
 * @param {TyTaskFilterQuery} whereConditions
 * @returns */
function getByOptions(whereConditions) {
  const query = Tasks.find(whereConditions);

  return query.exec();
}

/**
 * @param {TyTaskFilterQuery} whereConditions
 * @param {number} limit
 * @param {number} offset */
async function getAndCountByOptions(
  whereConditions,
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
) {
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
 * @param {TyTaskDocument} document 
 * @returns */
function toObject(document) {
  return document.toObject();
}

/**
 * @param {TyTask['userId']} userId
 * @returns */
function getByUserId(userId) {
  const query
    = Tasks.find({ userId });

  return query.exec();
}

/**
 * @param {TyTaskDocument} document
 * @returns */
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
