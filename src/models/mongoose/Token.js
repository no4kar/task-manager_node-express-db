'use strict';
// @ts-check

import {
  Schema,
  model,
} from 'mongoose';
import { DB_IDENTIFIERS } from '../entities.js';

/**
 * @typedef {import('src/types/token.type').TyToken.Item} TyToken
 * @typedef {import('src/types/db.type').TyMongoose.Schema<TyToken>} TyTokenSchema
 */

/** @type {TyTokenSchema} */
const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.String,
      ref: DB_IDENTIFIERS.USER.model,
      required: true,
    },
    refresh: {
      type: String,
      default: null,
    },
    activation: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Create and export the Token model using the defined schema
const TokenModel
  = model(DB_IDENTIFIERS.TOKEN.model, tokenSchema);

export default TokenModel;
