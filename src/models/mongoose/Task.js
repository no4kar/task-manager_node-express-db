'use strict';
// @ts-check

import {
  Schema,
  model,
} from 'mongoose';
import Todos from './Todo.js';
import { DB_IDENTIFIERS } from '../entities.js';

/**
 * @typedef {import('src/types/task.type.js')
 * .TyTask.Item
 * } TyTask
 * 
 * @typedef {import('src/types/db.type.js')
 * .TyMongoose.Schema<TyTask>
 * } TyTaskSchema
 * 
 * @typedef {import('src/types/db.type.js')
 * .TyMongoose.Document<unknown,{},TyTask>
 * } TyTaskDocument
 */

/** @type {TyTaskSchema} */
const taskSchema = new Schema(
  {
    id: {
      type: String,
      default: function () {
        return (/** @type {TyTaskDocument} */ (this))._id.toString(); // Assigns the MongoDB-generated `_id` to the `id` field
      },
    },
    userId: {
      type: Schema.Types.String,
      ref: DB_IDENTIFIERS.USER.model,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);


// Middleware to delete the associated Todos when a Task is removed
taskSchema.post('deleteOne',
  {
    document: true,
    query: false
  },
  async function (doc, next) {
    try {
      // Remove the associated todos
      await Todos.deleteMany({ taskId: doc._id });
      next();
    } catch (error) {
      next(/** @type {Error} */(error));
    }
  });

const TaskModel
  = model(DB_IDENTIFIERS.TASK.model, taskSchema);

export default TaskModel;
