'use strict';
// @ts-check

import { Schema, model } from 'mongoose';
import modelName from '../modelName.js';

/**
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo
 * @typedef {import('src/types/db.type').TyMongoose.Schema<TyTodo>} TyTodoSchema
 * @typedef {import('src/types/db.type.js').TyMongoose.Document<unknown,{},TyTodo>} TyTodoDocument
 */

// Define the schema for the User model
/** @type {TyTodoSchema} */
export const todoSchema = new Schema(
  {
    id: {
      type: String,
      default: function () {
        return (/** @type {TyTodoDocument} */ (this))._id.toString(); // eslint-disable-line
      },
    },
    userId: {
      type: Schema.Types.String,
      ref: modelName.user,
      required: true,
    },
    taskId: {
      type: Schema.Types.String,
      ref: modelName.task,
      required: true,
    },
    title: {
      type: String,
      default: 'none',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create and export the Model using the defined Schema
export const TodoModel
  = model(modelName.todo, todoSchema);