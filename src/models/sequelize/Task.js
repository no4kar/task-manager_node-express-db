'use strict';
// @ts-check

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../store/sequelize.db.js';
import { DB_IDENTIFIERS } from '../entities.js';
import UserModelStatic from './User.js';

/**
 * @typedef {import('src/types/task.type.js').TyTask.Item} TyTask
 * @typedef {import('src/types/task.type.js').TyTask.CreationAttributes} TyTaskCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyTask,TyTaskCreationAttributes>} TyTaskModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyTaskModel>} TyTaskModelStatic 
*/

/**
 * @class TaskModelStatic
 * @extends {Model<TyTask, TyTaskCreationAttributes>} */
class TaskModelStatic extends Model {}

TaskModelStatic.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModelStatic,
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
    modelName: DB_IDENTIFIERS.TASK.model,
    tableName: DB_IDENTIFIERS.TASK.table,
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
export default TaskModelStatic;
