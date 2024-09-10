// @ts-check
'use strict';

import { v1 as uuidv1 } from 'uuid';

import { ApiError } from '../../exceptions/api.error.js';
import { User as Users } from '../../models/mongoose/User.model.js';
import { emailService } from '../email.service.js';
import { bcryptService } from '../bcrypt.service.js';

/** @typedef {import('src/types/user.type.js').TyUser.Item} TyUser */
/** @typedef {import('src/types/user.type.js').TyUser.ItemNormalized} TyUserNormalized */
/** @typedef {import('src/types/user.type.js').TyUser.ItemPartial} TyUserPartial */
/** @typedef {import('src/types/db.type.js').TyMongoose.Query.Arr<TyUser>} TyUserQueryArr */
/** @typedef {import('src/types/db.type.js').TyMongoose.Query.Item<TyUser>} TyUserQueryItem */
/** @typedef {import('mongoose').FilterQuery<TyUser>} TyUserFilterQuery */

export const userService = {
  normalize,
  getAllActive,
  getByOptions,
  getAndCountAllByOptions,
  create,
  removeById,
  register,
};

/** @param {TyUserNormalized} itemNormalized */
function normalize({ id, email }) {
  return { id, email };
}

/** Retrieves all active users (i.e., users with no activation token) */
function getAllActive() {
  /** @type {TyUserQueryArr} */
  const query = Users.find({ activationToken: null });

  return query.sort({ createdAt: 'asc' }).exec();
}

/**
 * @param {TyUserPartial} itemPartial */
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

  /** @type {TyUserQueryItem} */
  const query = Users.findOne(whereConditions);

  return query.exec();
}

/**
 * @param {TyUserPartial} itemPartial
 * @param {number} [limit]
 * @param {number} [offset] */
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

  /** @type {TyUserQueryArr} */
  const query
    = Users.find(whereConditions);

  const rows = await query.limit(limit).skip(offset).exec();
  const count = await query.countDocuments().exec();

  return {
    rows,
    count,
  };
}

/**
 * @param {import('src/types/user.type.js').TyUser.CreationAttributes} properties */
function create(properties) {
  return Users.create({ ...properties });
}

/**
 * @param {import('src/types/user.type.js').TyUser.Item['id']} id
 * @returns {Promise<{acknowledged: boolean, deletedCount: number}>} */
async function removeById(id) {
  /** @type {TyUserQueryItem} */
  const query = Users.findOne({ id });

  return query.deleteOne().exec();
}

/** @param {{email: string, password: string}} params */
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
