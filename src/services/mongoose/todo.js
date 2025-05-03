'use strict';
// @ts-check

import mongoose from 'mongoose';
import Todos from '../../models/mongoose/Todo.js';

/**
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo
 * @typedef {import('src/types/todo.type.js').TyTodo.GetParams} TyTodoGetParams
 * @typedef {import('src/types/todo.type.js').TyTodo.UpdateParams} TyTodoUpdateParams
 * @typedef {import('src/types/todo.type.js').TyTodo.Normalized} TyTodoNormalized
 * @typedef {import('src/types/todo.type.js').TyTodo.Extended} TyTodoExtended
 * @typedef {import('src/types/todo.type.js').TyTodo.CreationAttributes} TyTodoCreationAttributes
 * @typedef {import('src/types/db.type.js').TyMongoose.Query.Filter<TyTodo>} TyTodoFilterQuery
 * @typedef {import('src/types/db.type.js').TyMongoose.Document<unknown,{},TyTodo>} TyTodoDocument
 */

export default {
  create,
  getAll,
  getByUserId,
  getAndCountByOptions,
  getById,
  update,
  updateById,
  updateByIdWithTransaction,
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
 * @param {TyTodoExtended} param0
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
 * @param {TyTodoDocument} document 
 * @returns */
function prepareToSend(document) {
  return normalize(toObject(document))
}

/**
 * Extracts a field value from a Mongoose document.
 * @template {keyof TyTodo} K
 * @param {TyTodoDocument} document
 * @param {K} key
 * @returns {TyTodo[K]} */
function getValue(document, key) {
  return document.get(key);
}

function getAll() {
  const query = Todos.find();

  return query.sort({ id: 'asc' }).exec();
}

/**
 * @param {TyTodoGetParams} getParams
 * @param {number} limit
 * @param {number} offset */
async function getAndCountByOptions(
  getParams,
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
) {
  /** @type {TyTodoFilterQuery} */
  const whereConditions = {};

  if (getParams.userId) {
    whereConditions.userId
      = getParams.userId;
  }
  if (getParams.taskId) {
    whereConditions.taskId
      = getParams.taskId;
  }
  if (getParams.title) {
    whereConditions.title
      = new RegExp(getParams.title, 'i');
  }
  if (getParams.completed) {
    whereConditions.completed
      = getParams.completed;
  }

  return {
    rows:
      await Todos.find(whereConditions)
        .limit(limit)
        .skip(offset)
        .exec(),
    count:
      await Todos.find(whereConditions)
        .countDocuments()
        .exec(),
  };
}

/**
 * @param {string} userId 
 * @returns */
function getByUserId(userId) {
  const query = Todos.find({ userId });

  return query.sort({ createdAt: 'asc' }).exec();
}

/**
 * @param {TyTodoDocument} document 
 * @returns */
function toObject(document) {
  return document.toObject();
}

/**
 * @param {string} id
 * @returns */
function getById(id) {
  const query = Todos.findOne({ id });

  return query.exec();
}

/**
 * @param {TyTodoDocument} document
 * @param {TyTodoGetParams} properties
 * @returns */
function update(document, properties) {
  return document.set(properties).save();
}

/**
 * @param {Array<TyTodo>} items
 * @returns */
function updateManyById(items) {
  const bulkOps = items.map(item => ({
    updateOne: {
      filter: { _id: item.id },    // Find the todo by ID
      update: { $set: item }       // Update the fields in the todo object
    }
  }));

  // const result = Todos.bulkWrite(bulkOps);
  return Todos.bulkWrite(bulkOps);
}

/**
 * @param {TyTodoCreationAttributes} properties 
 * @returns */
function create(properties) {
  return Todos.create({ ...properties });
}

/**
 * @param {TyTodoGetParams} updatedProps
 * @param {import('mongoose').ClientSession} [session] 
 * @returns {Promise<[affectedCount: number, affectedRows: TyTodoDocument[]]>}*/
async function updateById(updatedProps, session) {
  const {
    id,
    ...restProps
  } = updatedProps;

  const result
    = await Todos.updateOne(
      { _id: id }, // Filter by the document ID
      { $set: restProps }, // Set the new properties
      { session } // Pass the session if any (for transactions)
    );

  const updatedTodo
    = await Todos.findOne({ _id: id })
      .session(session || null); // Optional session

  if (!updatedTodo) {
    throw new Error(`Can't get updated todo`);
  }

  return [
    result.matchedCount,
    [updatedTodo],
  ];
}

/**
 * @param {TyTodoDocument} document
 * @returns */
function remove(document) {
  return document.deleteOne()
    .then(res => res.deletedCount);
}

/**
 * @param {TyTodo['id']} id
 * @returns {Promise<number>} */
function removeById(id) {
  const query = Todos.findOne({ id });

  return query.deleteOne().exec()
    .then(res => res.deletedCount);
}

/** @param {string[]} ids */
function removeByIds(ids) {
  return Todos.deleteMany({
    _id: { $in: ids },
  });
}

/**
 * @param {TyTodoGetParams} updatedProps */
async function updateByIdWithTransaction(updatedProps) {
  const { id, ...restProps } = updatedProps;

  /**
   * @param {import('mongoose').ClientSession} session
   * @returns */
  const cb = (session) => {
    return Todos.updateOne(
      { id },
      restProps,
      { session } // Pass the session to the update operation
    ).exec();
  }

  return sessionTransaction(cb);
}

/** Function to update a todo item within a transaction
 * @type {import('src/types/func.type.js').TyFunc.MongooseSessionTransaction} */
async function sessionTransaction(cb) {
  const session
    = await mongoose.startSession();

  try {
    session.startTransaction();

    const result
      = await cb(session);

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
