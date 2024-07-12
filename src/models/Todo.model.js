'use strict';
// @ts-check

import { DataTypes } from 'sequelize';
import { sequelize } from '../store/sqlite.db.js';

/** @type {import('../types/todo.type.js').ModelStatic} */
export const Todo = sequelize.define('todo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
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
