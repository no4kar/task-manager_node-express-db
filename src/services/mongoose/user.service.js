'use strict';
// @ts-check

import { v1 as uuidv1 } from 'uuid';

import { ApiError } from '../../exceptions/apiError.js';
import { UserModel as Users } from '../../models/mongoose/User.model.js';
import { tokenService } from '../mongoose/token.service.js';
import { emailService } from '../email.service.js';
import { bcryptService } from '../bcrypt.service.js';

/**
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUser
 * @typedef {import('src/types/user.type.js').TyUser.Extended} TyUserExtended
 * @typedef {import('src/types/user.type.js').TyUser.Normalized} TyUserNormalized
 * @typedef {import('src/types/user.type.js').TyUser.GetParams} TyUserGetParams
 * @typedef {import('src/types/user.type.js').TyUser.CreationAttributes} TyUserCreationAttributes
 * @typedef {import('src/types/db.type.js').TyMongoose.Query.Filter<TyUser>} TyUserFilterQuery
 * @typedef {import('src/types/db.type.js').TyMongoose.Document<unknown,{},TyUser>} TyUserDocument
 */

export const userService = {
  getActives,
  getByOptions,
  getOneByOptions,
  getAndCountByOptions,
  create,
  update,
  remove,
  removeById,

  normalize,
  toObject,
  prepareToSend,
  register,
};

/** 
 * @param {TyUserExtended} param0
 * @returns {TyUserNormalized} */
function normalize({ id, email }) {
  return { id, email };
}

/**
 * @param {TyUserDocument} document 
 * @returns */
function toObject(document) {
  return document.toObject();
}

/**
 * @param {TyUserDocument} document 
 * @returns */
function prepareToSend(document) {
  return normalize(toObject(document))
}

/** Retrieves all active users (i.e., users with no activation token) 
 * @returns {Promise<TyUserDocument[]>}*/
async function getActives() {
  const tokens
    = await tokenService.getByOptions({ activation: null });
  const userIds
    = tokens.map(token => token.userId);

  const usersQuery = Users.find({
    // id: { $in: ['New Task', 'First Task', 'Other Task'] },
    id: { $in: userIds }
  });

  return usersQuery.sort({ createdAt: 'asc' }).exec();
}

/**
 * @param {TyUserFilterQuery} whereConditions
 * @returns */
function getByOptions(whereConditions) {
  const query = Users.find(whereConditions);

  return query.exec();
}

/**
 * @param {TyUserFilterQuery} whereConditions
 * @returns */
function getOneByOptions(whereConditions) {
  const query = Users.findOne(whereConditions);

  return query.exec();
}

/**
 * @param {TyUserFilterQuery} whereConditions
 * @param {number} limit
 * @param {number} offset
 * @returns */
async function getAndCountByOptions(
  whereConditions,
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
) {
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
 * @param {TyUserGetParams} properties
 * @returns {Promise<TyUserDocument>}*/
function update(document, properties) {
  return document.set(properties).save();
}

/**
 * @param {TyUserCreationAttributes} properties 
 * @returns {Promise<TyUserDocument | null>} */
function create(properties) {
  return Users.create({ ...properties });
}

/**
 * @param {TyUserDocument} document
 * @returns {Promise<number>} */
function remove(document) {
  return document.deleteOne()
    .then(res => res.deletedCount);
}

/**
 * @param {TyUser['id']} id
 * @returns {Promise<number>} */
function removeById(id) {
  const query = Users.findById(id);

  return query.deleteOne().exec()
    .then(res => res.deletedCount);
}

/**
 * @param {{ email: string, password: string }} param0 
 * @returns {Promise<void>}*/
async function register({ email, password }) {
  const foundUser
    = await getOneByOptions({ email });

  if (foundUser) {
    throw ApiError.BadRequest(
      'Validation error', {
      email: 'User with this email is already exist',
    });
  }

  // get activation token
  const activationToken = uuidv1();
  // hash the password
  const hashedPassword
    = await bcryptService.hash(password);

  const createdUser
    = await create({
      email,
      password: hashedPassword,
    });

  if (!createdUser) {
    throw ApiError.UnprocessableContent(
      'Something went wrong');
  }

  const createdToken
    = await tokenService.create({
      userId: createdUser._id.toString(),
      refresh: null,
      activation: activationToken,
    });

  const activationFromToken
    = createdToken.activation;

  if (!createdToken || !activationFromToken) {
    throw ApiError.UnprocessableContent(
      'Something went wrong');
  }

  await emailService.sendActivationLink(
    createdUser.email,
    activationFromToken,
  );
}

uuidv1();
