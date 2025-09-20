'use strict';
// @ts-check

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../store/sequelize.db.js';
import { DB_IDENTIFIERS } from '../entities.js';

const {
  model: modelName,
  table: tableName,
} = DB_IDENTIFIERS.USER;

/**
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUser
 * @typedef {import('src/types/user.type.js').TyUser.CreationAttributes} TyUserCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyUser,TyUserCreationAttributes>} TyUserModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyUserModel>} TyUserModelStatic
 */

/**
 * @class UserModelStatic
 * @extends {Model<TyUser, TyUserCreationAttributes>} */
class UserModelStatic extends Model { }

UserModelStatic.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email cannot be null",
        },
        notEmpty: {
          msg: "Email cannot be empty",
        },
        // Use the 'is' validator for regex
        // is: {
        //   args: /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/i, // Your regex here (added 'i' for case-insensitivity, optional)
        //   msg: "Please enter a valid email address format." // Custom error message
        // },
      }
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
    modelName,
    tableName,
    timestamps: true, // Sequelize will manage createdAt and updatedAt
    underscored: false, // Optional: depends on your naming convention
  }
);

/** @type {TyUserModelStatic} */
export default UserModelStatic;
