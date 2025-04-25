'use strict';
// @ts-check

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../store/sqlite.db.js';
import { UserModel } from './User.model.js';

/**
 * @typedef {import('src/types/token.type.js').TyToken.Item} TyToken
 * @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyToken,TyTokenCreationAttributes>} TyTokenModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyTokenModel>} TyTokenModelStatic
 */

/**
 * @class TokenModelStatic
 * @extends {Model<TyToken, TyTokenCreationAttributes>}
 * @implements {TyToken} */
export class TokenModelStatic extends Model {
  userId = '';
  refresh = '';
  activation = '';
  createdAt = new Date();
  updatedAt = new Date();
}

TokenModelStatic.init(
  {
    userId: {
      type: DataTypes.UUIDV1,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    refresh: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
      unique: true,
    },
    activation: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
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
    modelName: 'Token',
    tableName: 'tokens',
    timestamps: true, // Sequelize will manage createdAt and updatedAt
    underscored: false, // Optional: depends on your naming convention
  }
);

/** @type {TyTokenModelStatic} */
export const TokenModel = TokenModelStatic;