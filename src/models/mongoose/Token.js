'use strict';
// @ts-check

import {
  Schema,
  model,
} from 'mongoose';
import { DB_IDENTIFIERS } from '../entities.js';

const {
  model: modelName,
  // table: tableName,
} = DB_IDENTIFIERS.TOKEN;

/**
 * @typedef {import('src/types/token.type.js')
 * .TyToken.Item
 * } TyToken
 * 
 * @typedef {import('src/types/db.type.js')
 * .TyMongoose.Schema<TyToken>
 * } TyTokenSchema
 */

/** @type {TyTokenSchema} */
const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.String,
      ref: modelName,
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
  = model(modelName, tokenSchema);

export default TokenModel;
