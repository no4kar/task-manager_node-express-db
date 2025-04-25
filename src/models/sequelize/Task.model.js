'use strict';
// @ts-check

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../store/sqlite.db.js';
import { UserModel } from './User.model.js';

/**
 * @typedef {import('src/types/task.type.js').TyTask.Item} TyTask
 * @typedef {import('src/types/task.type.js').TyTask.CreationAttributes} TyTaskCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyTask,TyTaskCreationAttributes>} TyTaskModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyTaskModel>} TyTaskModelStatic 
*/

/**
 * @class TaskModelStatic
 * @extends {Model<TyTask, TyTaskCreationAttributes>}
 * @implements {TyTask} */
export class TaskModelStatic extends Model {
  id = '';
  userId = '';
  name = '';
  createdAt = new Date();
  updatedAt = new Date();
}

TaskModelStatic.init(
  {
    id: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUIDV1,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true, // Sequelize will manage createdAt and updatedAt
    underscored: false, // Optional: depends on your naming convention
    // hooks: {
    //   // Automatically delete associated todos
    //   async beforeDestroy(task, options) {
    //     await Todo.destroy({
    //       where: {
    //         taskId: task.id,
    //       },
    //     });
    //   },
    //   // Automatically delete for bulk deletes
    //   async beforeBulkDestroy(options) {
    //     const tasks = await Task.findAll({ where: options.where });
    //     const ids = tasks.map(t => t.id);

    //     await Todo.destroy({
    //       where: { taskId: ids },
    //     });
    //   },
    // },
  }
);

/** @type {TyTaskModelStatic} */
export const TaskModel = TaskModelStatic;
