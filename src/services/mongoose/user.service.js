'use strict';
// @ts-check

import { v1 as uuidv1 } from 'uuid';

import { ApiError } from '../../exceptions/api.error.js';
import { User as Users } from '../../models/mongoose/User.model.js';
import { emailService } from '../email.service.js';
import { bcryptService } from '../bcrypt.service.js';

/**
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUser
 * @typedef {import('src/types/user.type.js').TyUser.ItemExtended} TyUserExtended
 * @typedef {import('src/types/user.type.js').TyUser.ItemNormalized} TyUserNormalized
 * @typedef {import('src/types/user.type.js').TyUser.ItemPartial} TyUserPartial
 * @typedef {import('src/types/user.type.js').TyUser.CreationAttributes} TyUserCreationAttributes
 * @typedef {import('src/types/db.type.js').TyMongoose.Query.Filter<TyUser>} TyUserFilterQuery
 * @typedef {import('src/types/db.type.js').TyMongoose.Document<unknown,{},TyUser>} TyUserDocument
 */

export const userService = {
  normalize,
  getAllActive,
  getDataValue,
  getByOptions,
  getAndCountAllByOptions,
  update,
  create,
  removeById,
  register,
};

/** 
 * @param {TyUserExtended} param0
 * @returns {TyUserNormalized} */
function normalize({ id, email }) {
  return { id, email };
}

/** Retrieves all active users (i.e., users with no activation token) */
function getAllActive() {
  const query = Users.find({ activationToken: null });

  return query.sort({ createdAt: 'asc' }).exec();
}

/**
 * @param {TyUserDocument} document 
 * @returns */
function getDataValue(document) {
  return document.toObject();
}

/**
 * @param {TyUserPartial} param0
 * @returns */
function getByOptions({
  id,
  email,
  activationToken,
}) {
  /** @type {TyUserFilterQuery} */
  const whereConditions = {};

  if (id !== undefined) {
    whereConditions.id = id;
  }

  if (email !== undefined) {
    whereConditions.email = email;
  }

  if (activationToken !== undefined) {
    whereConditions.activationToken = activationToken;
  }

  const query = Users.findOne(whereConditions);

  return query.exec();
}

/**
 * @param {TyUserPartial} param0
 * @param {number} limit
 * @param {number} offset
 * @returns */
async function getAndCountAllByOptions({
  id,
  email,
  activationToken,
},
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
) {
  /** @type {TyUserFilterQuery} */
  const whereConditions = {};

  if (id !== undefined) {
    whereConditions.id = id;
  }

  if (email !== undefined) {
    whereConditions.email = email;
  }

  if (activationToken !== undefined) {
    whereConditions.activationToken = activationToken;
  }

  return {
    rows:
      await Users.find(whereConditions)
        .limit(limit)
        .skip(offset)
        .exec(),
    count:
      await Users.find(whereConditions)
        .countDocuments()
        .exec(),
  };
}

/**
 * @param {TyUserDocument} document
 * @param {TyUserPartial} properties
 * @returns */
function update(document, properties) {
  return document.set(properties).save();
}

/**
 * @param {TyUserCreationAttributes} properties 
 * @returns */
function create(properties) {
  return Users.create({ ...properties });
}

/**
 * @param {TyUser['id']} id
 * @returns {Promise<{ acknowledged: boolean, deletedCount: number }>} */
function removeById(id) {
  const query = Users.findOne({ id });

  return query.deleteOne().exec();
}

/**
 * @param {{ email: string, password: string }} param0 
 * @returns {Promise<void>}*/
async function register({ email, password }) {
  const foundUser = await getByOptions({ email });

  if (foundUser) {
    throw ApiError.BadRequest('Validation error', {
      email: 'Email is already exist',
    });
  }

  // get activation token
  const activationToken = uuidv1();
  // hash the password
  const hashedPassword
    = await bcryptService.hash(password);

  const createdUser = await Users.create({
    email,
    password: hashedPassword,
    activationToken,
  });

  if (!createdUser.activationToken) {
    throw new Error('something went wrong');
  }

  await emailService.sendActivationLink(
    createdUser.email,
    createdUser.activationToken,
  );
}

uuidv1();
