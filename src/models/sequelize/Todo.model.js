'use strict';
// @ts-check

import { DataTypes } from 'sequelize';
import { sequelize } from '../../store/sqlite.db.js';
import { User } from './User.model.js';

/** @type {import('src/types/todo.type.js').TyTodo.ModelStatic} */
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
