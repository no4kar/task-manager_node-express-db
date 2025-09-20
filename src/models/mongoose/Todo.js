'use strict';
// @ts-check

import { Schema, model } from 'mongoose';
import { DB_IDENTIFIERS } from '../entities.js';

/**
 * @typedef {import('src/types/todo.type.js')
 * .TyTodo.Item
 * } TyTodo
 * 
 * @typedef {import('src/types/db.type.js')
 * .TyMongoose.Schema<TyTodo>
 * } TyTodoSchema
 * 
 * @typedef {import('src/types/db.type.js')
 * .TyMongoose.Document<unknown,{},TyTodo>
 * } TyTodoDocument
 */

// Define the schema for the User model
/** @type {TyTodoSchema} */
const todoSchema = new Schema(
  {
    id: {
      type: String,
      default: function () {
        return (/**@type {TyTodoDocument}*/(this))._id.toString();
      },
    },
    userId: {
      type: Schema.Types.String,
      ref: DB_IDENTIFIERS.USER.model,
      required: true,
    },
    taskId: {
      type: Schema.Types.String,
      ref: DB_IDENTIFIERS.TASK.model,
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
const TodoModel
  = model(DB_IDENTIFIERS.TODO.model, todoSchema);

export default TodoModel;