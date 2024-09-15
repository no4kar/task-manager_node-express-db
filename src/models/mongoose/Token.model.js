'use strict';
// @ts-check

import {
  Schema,
  model,
} from 'mongoose';
import modelName from '../modelName.js';

/**
 * @typedef {import('src/types/token.type').TyToken.Item} TyToken
 * @typedef {import('src/types/db.type').TyMongoose.Schema<TyToken>} TyTokenSchema
 */

/** @type {TyTokenSchema} */
const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: modelName.user,
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

// Create and export the Token model using the defined schema
export const Token
  = model(modelName.token, tokenSchema);

