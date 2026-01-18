'use strict';
// @ts-check

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#src/store/sequelize.db.js';
import { DB_IDENTIFIERS } from '../entities.js';
import UserModelStatic from './User.js';

/**
 * @typedef {import('src/types/token.type.js').TyToken.Item} TyToken
 * @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyToken,TyTokenCreationAttributes>} TyTokenModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyTokenModel>} TyTokenModelStatic
 */

/**
 * @class TokenModelStatic
 * @extends {Model<TyToken, TyTokenCreationAttributes>} */
class TokenModelStatic extends Model {}

TokenModelStatic.init(
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModelStatic,
        key: 'id',
      },
    },
    refresh: {
      type: DataTypes.TEXT, // much longer than DataTypes.STRING
      allowNull: true,
      defaultValue: '',
      unique: true,
    },
    activation: {
      type: DataTypes.STRING, // VARCHAR(255)
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
    modelName: DB_IDENTIFIERS.TOKEN.model,
    tableName: DB_IDENTIFIERS.TOKEN.table,
    timestamps: true, // Sequelize will manage createdAt and updatedAt
    underscored: false, // Optional: depends on your naming convention
  }
);

/** @type {TyTokenModelStatic} */
export default TokenModelStatic;