'use strict';
// @ts-check

import { DataTypes } from 'sequelize';
import { sequelize } from '../../store/sqlite.db.js';
import { User } from './User.model.js';

/**
 * @typedef {import('src/types/token.type.js').TyToken.Item} TyToken
 * @typedef {import('src/types/token.type.js').TyToken.CreationAttributes} TyTokenCreationAttributes
 * @typedef {import('src/types/db.type.js').TySequelize.Model<TyToken, TyTokenCreationAttributes>} TyTokenModel
 * @typedef {import('src/types/db.type.js').TySequelize.ModelStatic<TyTokenModel>} TyTokenModelStatic
 */

/** @type {TyTokenModelStatic} */
export const Token = sequelize.define('token', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  refres: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  activation:{
    type: DataTypes.STRING,
    allowNull: true,
  }
});
