'use strict';
// @ts-check

import mongoose from 'mongoose';
import { Todo as Todos } from '../../models/mongoose/Todo.model.js';

/**
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo
 * @typedef {import('src/types/todo.type.js').TyTodo.ItemPartial} TyTodoPartial
 * @typedef {import('src/types/todo.type.js').TyTodo.ItemNormalized} TyTodoNormalized 
 * @typedef {import('src/types/todo.type.js').TyTodo.ItemExtended} TyTodoExtended 
 * @typedef {import('src/types/todo.type.js').TyTodo.CreationAttributes} TyTodoCreationAttributes 
 * @typedef {import('src/types/db.type.js').TyMongoose.Query.Filter<TyTodo>} TyTodoFilterQuery
 * @typedef {import('src/types/db.type.js').TyMongoose.FoundDocument<unknown,{},TyTodo>} TyTodoFoundDocument
 */

export const todoService = {
  normalize,
  getAll,
  getAllByUser,
  getAndCountAllByOptions,
  getById,
  setDataValues,
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
 * @param {TyTodoFoundDocument} document
 * @param {TyTodoPartial} properties
 * @returns */
function setDataValues(document, properties) {
  return document.set(properties).save();
}

/**
 * @param {TyTodoCreationAttributes} properties 
 * @returns */
function create(properties) {
  return Todos.create({ ...properties });
}

/**
 * @param {TyTodoPartial} updatedProps
 * @param {import('mongoose').ClientSession} [session] 
 * @returns {Promise<[affectedCount: number, affectedRows: TyTodoFoundDocument[]]>}*/
async function updateById(updatedProps, session) {
  const { id, ...restProps } = updatedProps;

  const result = await Todos.updateOne(
    { _id: id }, // Filter by the document ID
    { $set: restProps }, // Set the new properties
    { session } // Pass the session if any (for transactions)
  );

  const updatedTodo = await Todos.findOne({ _id: id }).session(session || null); // Optional session

  if (!updatedTodo) {
    throw new Error(`Can't get updated todo`);
  }

  return [
    result.matchedCount,
    [updatedTodo],
  ];
}

/** @param {TyTodo['id']} id */
function removeById(id) {
  const query = Todos.findOne({ id });

  return query.deleteOne().exec();
}

/**
 * @param {TyTodoPartial} updatedProps */
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
 * @type {import('src/types/func.type.js').MongooseSessionTransaction} */
async function sessionTransaction(cb) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await cb(session);

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
