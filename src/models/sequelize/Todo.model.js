'use strict';
// @ts-check

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../store/sqlite.db.js';
import { UserModel } from './User.model.js';
import { TaskModel } from './Task.model.js';

/**
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo
 * @typedef {import('src/types/todo.type.js').TyTodo.CreationAttributes} TyTodoCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyTodo,TyTodoCreationAttributes>} TyTodoModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyTodoModel>} TyTodoModelStatic
 */

/** 
 * @class TodoModelStatic
 * @extends {Model<TyTodo, TyTodoCreationAttributes>}
 * @implements {TyTodo} */
export class TodoModelStatic extends Model {
  id = '';
  userId = '';
  taskId = '';
  title = '';
  completed = false;
  createdAt = new Date();
  updatedAt = new Date();
};


TodoModelStatic.init(
  {
    id: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUIDV1,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    taskId: {
      type: DataTypes.UUIDV1,
      allowNull: false,
      references: {
        model: TaskModel,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: 'none',
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
    modelName: 'Todo',
    tableName: 'todos',
    timestamps: true, // Sequelize will manage createdAt and updatedAt
    underscored: false, // Optional: depends on your naming convention
  }
);

/** @type {TyTodoModelStatic} */
export const TodoModel = TodoModelStatic;
