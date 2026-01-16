'use strict';
// @ts-check

import {
  Schema,
} from 'mongoose';

/**
 * @template DocType
 * @typedef {import('#types/db.type.js')
 * .TyMongoose.Schema<DocType>
 * } TyMongooseSchema
 */

/**
 * @typedef {import('#types/general.type.js')
 * .TyGeneral.Image
 * } TyImage
 */

// --- Reusable Sub-Schemas ---
/**@type {TyMongooseSchema<TyImage>}*/
export const imageSchema = new Schema({
  raw: { type: Buffer, default: null },
  src: { type: String, default: null },
}, { _id: false });
