'use strict';
// @ts-check

import { Schema, model } from 'mongoose';
import { v1 as uuidv1 } from 'uuid'; // Import UUIDv1 for generating tokens

/**
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUserItem */

// Define the schema for the User model
/** @type {import('mongoose').Schema<TyUserItem>} */
const userSchema = new Schema(
  {
    id: {
      type: String,
      default: () => uuidv1(), // Generates a UUIDv1 string for the `id`
      required: true,
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
      default: null, // Allows the value to be null by default
      required: false,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create and export the User model using the defined schema
/** @type {import('mongoose').Model<TyUserItem>} */
export const User = model('users', userSchema);
