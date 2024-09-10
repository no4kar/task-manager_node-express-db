// @ts-check
'use strict';

import { Schema, model } from 'mongoose';
// import { userNameModel } from './User.model.js';

/**
 * @typedef {import('src/types/token.type').TyToken.Item} TyTokenItem
 * @typedef {import('mongoose').Types.ObjectId} ObjectId
 */

export const tokenNameModel = 'tokens';

// Define the schema for the User model
/** @type {import('mongoose').Schema<TyTokenItem>} */
const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create and export the User model using the defined schema
/** @type {import('mongoose').Model<import('mongoose').HydratedDocument<TyTokenItem>>} */
export const Token = model(tokenNameModel, tokenSchema);
