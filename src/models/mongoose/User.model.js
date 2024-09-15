'use strict';
// @ts-check

import {
  Schema,
  model,
} from 'mongoose';
import { Token as Tokens } from './Token.model.js';
import modelName from '../modelName.js';

/**
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUser
 * @typedef {import('src/types/db.type.js').TyMongoose.Schema<TyUser>} TyUserSchema
 */

/** @type {TyUserSchema} */
const userSchema = new Schema(
  {
    id: {
      type: String,
      default: function () {
        return this._id.toString(); // Assigns the MongoDB-generated `_id` to the `id` field
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    activationToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    // toJSON: { virtuals: true, versionKey: false }, // Removes the __v version key from JSON output
    // toObject: { virtuals: true, versionKey: false }, // Removes the __v version key from Object output
  }
);

// Pre-save hook to copy the MongoDB `_id` to the custom `id` field
userSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
  next();
});

// Middleware to delete the associated Token when a User is removed
userSchema.post('deleteOne', { document: true, query: false }, async function (doc, next) {
  try {
    // Remove the associated token
    await Tokens.deleteOne({ userId: doc._id });
    next();
  } catch (error) {
    next(error);
  }
});

// Transform the output to remove `_id` field from the final JSON
// userSchema.set('toJSON', {
//   transform: (doc, ret) => {
//     delete ret._id; // Removes the _id field from the output
//     return ret;
//   }
// });

// Transform the output to remove `_id` field from the final Object
// userSchema.set('toObject', {
//   transform: (doc, ret) => {
//     delete ret._id; // Removes the _id field from the output
//     return ret;
//   }
// });

export const User
  = model(modelName.user, userSchema);
