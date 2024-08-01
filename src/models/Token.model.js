'use strict';
// @ts-check

import { DataTypes } from 'sequelize';
import { sequelize } from '../store/sqlite.db.js';
import { User } from './User.model.js';

/** @type {import('../types/token.type.js').TyToken.ModelStatic} */
export const Token = sequelize.define('token', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
