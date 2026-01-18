'use strict';
// @ts-check

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#src/store/sequelize.db.js';
import { DB_IDENTIFIERS } from '../entities.js';
import UserModelStatic from './User.js';
import TaskModelStatic from './Task.js';

/**
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo
 * @typedef {import('src/types/todo.type.js').TyTodo.CreationAttributes} TyTodoCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyTodo,TyTodoCreationAttributes>} TyTodoModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyTodoModel>} TyTodoModelStatic
 */

/** 
 * @class TodoModelStatic
 * @extends {Model<TyTodo, TyTodoCreationAttributes>} */
class TodoModelStatic extends Model {};

TodoModelStatic.init(
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
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TaskModelStatic,
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
    modelName: DB_IDENTIFIERS.TODO.model,
    tableName: DB_IDENTIFIERS.TODO.table,
    timestamps: true, // Sequelize will manage createdAt and updatedAt
    underscored: false, // Optional: depends on your naming convention
  }
);

/** @type {TyTodoModelStatic} */
export default TodoModelStatic;
