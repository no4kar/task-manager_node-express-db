'use strict';
// @ts-check

import { v1 as uuidv1 } from 'uuid';

import { ApiError } from '#src/exceptions/apiError.js';
import Users from '#models/sequelize/User.js';
import { emailService as emlSrv } from '../email.service.js';
import tknSrv from './token.js';
import { bcryptService as bcrSrv } from '../bcrypt.service.js';

/** @typedef {import('src/types/user.type.js').TyUser.Item} TyUser */
/** @typedef {import('src/types/user.type.js').TyUser.CreationAttributes} TyUserCreationAttributes */
/** @typedef {import('src/types/db.type.js').TySequelize.Model<TyUser, TyUserCreationAttributes>} TyUserModel */
/** @typedef {import('src/types/db.type.js').TySequelize.Query.WhereOptions<TyUser>} TyUserWhereOptions */
/** @typedef {import('src/types/user.type.js').TyUser.Normalized} TyUserNormalized */
/** @typedef {import('src/types/user.type.js').TyUser.GetParams} TyUserGetParams */

export default {
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
  getValue,
  register,
};

/** @param {TyUserNormalized} Normalized */
function normalize({ id, email }) {
  return { id, email };
}

/**
 * @param {TyUserModel} model 
 * @returns */
function toObject(model) {
  return model.dataValues;
}

/**
 * @param {TyUserModel} model 
 * @returns */
function prepareToSend(model) {
  return normalize(toObject(model))
}

/**
 * Extracts a field value from a Mongoose document.
 * @template {keyof TyUser} K
 * @param {TyUserModel} model
 * @param {K} key
 * @returns {TyUser[K]} */
function getValue(model, key) {
  return model.getDataValue(key);
}

/** Retrieves all active users (i.e., users with no activation token) 
 * @returns {Promise<TyUserModel[]>}*/
async function getActives() {
  const tokens
    = await tknSrv.getByOptions({ activation: null });
  const userIds
    = tokens.map(token => token.getDataValue('userId'));

  return Users.findAll({
    where: {
      // id: { in: ['New User', 'First User', 'Other User'] }
      id: { in: userIds },
    },
    order: [['id', 'ASC']],
  });
}

/**
 * @param {TyUserWhereOptions} whereConditions 
 * @returns {Promise<TyUserModel[]>}*/
function getByOptions(whereConditions) {
  return Users.findAll({
    where: whereConditions,
  });
}

/**
 * @param {TyUserWhereOptions} whereConditions
 * @returns {Promise<TyUserModel | null>}*/
function getOneByOptions(whereConditions) {
  return Users.findOne({ where: whereConditions });
}

/**
 * @param {TyUserWhereOptions} whereConditions
 * @param {number} limit
 * @param {number} offset */
function getAndCountByOptions(
  whereConditions,
  limit = Number.MAX_SAFE_INTEGER,
  offset = 0,
) {
  return Users.findAndCountAll({
    where: whereConditions,
    limit,
    offset,
  });
}

/**
 * @param {TyUserModel} model
 * @param {TyUserGetParams} properties
 * @returns */
function update(model, properties) {
  return model.set(properties).save();
}

/**
 * @param {TyUserCreationAttributes} properties 
 * @returns {Promise<TyUserModel | null>} */
function create(properties) {
  return Users.create({ ...properties });
}


/**
 * @param {TyUserModel} model
 * @returns {Promise<number>} */
function remove(model) {
  return model.destroy()
    .then(() => 1);
}

/**
 * @param {TyUser['id']} id
 * @returns {Promise<number>} */
async function removeById(id) {
  return Users.destroy({
    where: { id },
  });
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
    = await bcrSrv.hash(password);

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
    = await tknSrv.create({
      userId: createdUser.getDataValue('id'),
      refresh: null,
      activation: activationToken,
    });

  const activationFromToken
    = createdToken.getDataValue('activation');

  if (!createdToken || !activationFromToken) {
    throw ApiError.UnprocessableContent(
      'Something went wrong');
  }

  await emlSrv.sendActivationLink(
    createdUser.getDataValue('email'),
    activationFromToken,
  );
}

uuidv1();
