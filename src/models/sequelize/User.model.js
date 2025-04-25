'use strict';
// @ts-check

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../store/sqlite.db.js';

/**
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUser
 * @typedef {import('src/types/user.type.js').TyUser.CreationAttributes} TyUserCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyUser,TyUserCreationAttributes>} TyUserModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyUserModel>} TyUserModelStatic
 */

/**
 * @class UserModelStatic
 * @extends {Model<TyUser, TyUserCreationAttributes>}
 * @implements {TyUser} */
export class UserModelStatic extends Model {
  id = '';
  email = '';
  password = '';
  createdAt = new Date();
  updatedAt = new Date();
}

// `User.init` instead of `sequelize.define`
UserModelStatic.init(
  {
    id: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
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
    modelName: 'User',
    tableName: 'users',
    timestamps: true, // Sequelize will manage createdAt and updatedAt
    underscored: false, // Optional: depends on your naming convention
  }
);

/** @type {TyUserModelStatic} */
export const UserModel = UserModelStatic;
