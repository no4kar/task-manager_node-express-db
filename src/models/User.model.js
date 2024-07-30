'use strict';
// @ts-check

import { DataTypes } from 'sequelize';
import { sequelize } from '../store/sqlite.db.js';

/** @type {import('../types/user.type.js').TyUser.ModelStatic} */
export const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activationToken: {
    type: DataTypes.STRING,
  },
});
