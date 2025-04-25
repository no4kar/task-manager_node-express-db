'use strict';
// @ts-check

import { v1 as uuidv1 } from 'uuid';

import { ApiError } from '../../exceptions/apiError.js';
import { UserModel as Users } from '../../models/sequelize/User.model.js';
import { emailService } from '../email.service.js';
import { tokenService } from '../sequelize/token.service.js';
import { bcryptService } from '../bcrypt.service.js';

/** @typedef {import('src/types/user.type.js').TyUser.Item} TyUser */
/** @typedef {import('src/types/user.type.js').TyUser.CreationAttributes} TyUserCreationAttributes */
/** @typedef {import('src/types/db.type.js').TySequelize.Model<TyUser, TyUserCreationAttributes>} TyUserModel */
/** @typedef {import('src/types/db.type.js').TySequelize.Query.WhereOptions<TyUser>} TyUserWhereOptions */
/** @typedef {import('src/types/user.type.js').TyUser.Normalized} TyUserNormalized */
/** @typedef {import('src/types/user.type.js').TyUser.GetParams} TyUserGetParams */

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

/** Retrieves all active users (i.e., users with no activation token) 
 * @returns {Promise<TyUserModel[]>}*/
async function getActives() {
  const tokens
    = await tokenService.getByOptions({ activation: null });
  const userIds
    = tokens.map(token => token.getDataValue('userId'));

  return Users.findAll({
    where: {
      // id: { in: ['New Task', 'First Task', 'Other Task'] }
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
  const foundUser = await Users.findByPk(id);

  if (!foundUser) {
    throw ApiError.BadRequest(
      'Validation error', {
      id: 'User isn\'t exist',
    });
  }

  return remove(foundUser);
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

  await emailService.sendActivationLink(
    createdUser.getDataValue('email'),
    activationFromToken,
  );
}

uuidv1();
