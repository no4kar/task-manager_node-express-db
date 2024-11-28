'use strict';
// @ts-check

import { v1 as uuidv1 } from 'uuid';

import { ApiError } from '../../exceptions/api.error.js';
import { User as Users } from '../../models/sequelize/User.model.js';
import { emailService } from '../email.service.js';
import { bcryptService } from '../bcrypt.service.js';

/** @typedef {import('src/types/user.type.js').TyUser.Item} TyUser */
/** @typedef {import('src/types/user.type.js').TyUser.CreationAttributes} TyUserCreationAttributes */
/** @typedef {import('src/types/db.type.js').TySequelize.Model<TyUser, TyUserCreationAttributes>} TyUserModel */
/** @typedef {import('src/types/user.type.js').TyUser.Normalized} TyUserNormalized */
/** @typedef {import('src/types/user.type.js').TyUser.GetParams} TyUserGetParams */

export const userService = {
  normalize,
  getActives,
  getByOptions,
  getAndCountByOptions,
  setDataValues,
  create,
  register,
};

/** @param {TyUserNormalized} Normalized */
function normalize({ id, email }) {
  return { id, email };
}

function getActives() {
  return Users.findAll({
    where: {
      activationToken: null,
    },
    order: [['id', 'ASC']],
  });
}

/**
 * @param {import('sequelize').WhereOptions<TyUser>} whereConditions */
function getByOptions(whereConditions) {
  return Users.findAll({
    where: whereConditions,
  });
}

/**
 * @param {import('sequelize').WhereOptions<TyUser>} whereConditions
 * @param {number} [limit]
 * @param {number} [offset] */
function getAndCountByOptions(
  whereConditions,
  limit,
  offset,
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
function setDataValues(model, properties) {
  return model.set(properties).save();
}

/**
 * @param {import('src/types/user.type.js').TyUser.CreationAttributes} properties */
function create(properties) {
  return Users.create({ ...properties });
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

  if (!createdUser.dataValues.activationToken) {
    throw new Error('something went wrong');
  }

  await emailService.sendActivationLink(
    createdUser.dataValues.email,
    createdUser.dataValues.activationToken,
  );
}

uuidv1();
