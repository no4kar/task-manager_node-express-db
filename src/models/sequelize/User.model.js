'use strict';
// @ts-check

import { DataTypes } from 'sequelize';
import { sequelize } from '../../store/sqlite.db.js';

/**
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUser
 * @typedef {import('src/types/user.type.js').TyUser.CreationAttributes} TyUserCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyUser, TyUserCreationAttributes>} TyUserModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyUserModel>} TyUserModelStatic
 */

/** @type {TyUserModelStatic} */
export const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activationToken: {
    type: DataTypes.UUIDV1,
    allowNull: true,
  },
});
