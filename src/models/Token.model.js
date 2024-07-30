'use strict';
// @ts-check

import { DataTypes } from 'sequelize';
import { sequelize } from '../store/sqlite.db.js';
import { User } from './User.model.js';

/** @type {import('../types/token.type.js').TyToken.ModelStatic} */
export const Token = sequelize.define('token', {
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Token.belongsTo(User);
User.hasOne(Token);
