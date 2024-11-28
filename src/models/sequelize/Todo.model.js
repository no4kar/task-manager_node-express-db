'use strict';
// @ts-check

import { DataTypes } from 'sequelize';
import { sequelize } from '../../store/sqlite.db.js';
import { User } from './User.model.js';


/**
 * @typedef {import('src/types/todo.type.js').TyTodo.Item} TyTodo
 * @typedef {import('src/types/todo.type.js').TyTodo.CreationAttributes} TyTodoCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyTodo, TyTodoCreationAttributes>} TyTodoModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyTodoModel>} TyTodoModelStatic
 */

/** @type {TyTodoModelStatic} */
export const Todo = sequelize.define('todo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
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
});
