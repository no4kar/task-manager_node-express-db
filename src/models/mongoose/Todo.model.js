'use strict';
// @ts-check

import { Schema, model } from 'mongoose';
import modelName from '../modelName.js';

/**
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo
 * @typedef {import('src/types/db.type').TyMongoose.Schema<TyTodo>} TyTodoSchema
 */

// Define the schema for the User model
/** @type {TyTodoSchema} */
export const todoSchema = new Schema(
  {
    id: {
      type: String,
      default: function () {
        return this._id.toString(); // Assigns the MongoDB-generated `_id` to the `id` field
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: modelName.user,
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

// Create and export the User model using the defined schema
export const Todo
  = model(modelName.todo, todoSchema);