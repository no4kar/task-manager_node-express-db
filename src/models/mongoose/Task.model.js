'use strict';
// @ts-check

import {
  Schema,
  model,
} from 'mongoose';
import { Todo as Todos } from './Todo.model.js';
import modelName from '../modelName.js';

/**
 * @typedef {import('src/types/task.type.js').TyTask.Item} TyTask
 * @typedef {import('src/types/db.type.js').TyMongoose.Schema<TyTask>} TyTaskSchema
 */

/** @type {TyTaskSchema} */
export const taskSchema = new Schema(
  {
    id: {
      type: String,
      default: function () {
        return this._id.toString(); // Assigns the MongoDB-generated `_id` to the `id` field
      },
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // lowercase: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Pre-save hook to copy the MongoDB `_id` to the custom `id` field
taskSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
  next();
});

// Middleware to delete the associated Todos when a Task is removed
taskSchema.post('deleteOne', { document: true, query: false }, async function (doc, next) {
  try {
    // Remove the associated todos
    await Todos.deleteMany({ taskId: doc._id });
    next();
  } catch (error) {
    next(error);
  }
});

export const Task
  = model(modelName.task, taskSchema);
