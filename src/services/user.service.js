'use strict';
// @ts-check

import bcrypt from 'bcrypt';
import { v1 as uuidv1 } from 'uuid';

import { emailService } from '../services/email.service.js';
import { bcrypt as bcryptConfig } from '../configs/env.config.js';
import { ApiError } from '../exceptions/api.error.js';
import { User } from '../models/User.model.js';

/** @typedef {import('src/types/user.type.js').TyUser.Item} TyUser */
/** @typedef {import('src/types/user.type.js').TyUser.ItemNormalized} TyUserNormalized */
/** @typedef {import('src/types/user.type.js').TyUser.ItemPartial} TyUserPartial */

export const userService = {
  getAllActive,
  normalize,
  getByOptions,
  getAndCountAllByOptions,
  register,
};

function getAllActive() {
  return User.findAll({
    where: {
      activationToken: null,
    },
    order: [['id', 'ASC']],
  });
}

/**
 * @param {TyUserPartial} itemPartial */
function getByOptions({
  id,
  email,
  activationToken,
}) {
  /**@type {import('sequelize').WhereOptions<TyUser>} */
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

  console.info(whereConditions);

  return User.findOne({
    where: whereConditions,
  });
}

/**
 * @param {TyUserPartial} itemPartial
 * @param {number} [limit]
 * @param {number} [offset] */
function getAndCountAllByOptions({
  id,
  email,
  activationToken,
},
  limit,
  offset,
) {
  /**@type {import('sequelize').WhereOptions<TyUser>} */
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

  console.info(whereConditions);

  return User.findAndCountAll({
    where: whereConditions,
    limit,
    offset,
  });
}

/** @param {TyUserNormalized} itemNormalized */
function normalize({ id, email }) {
  return { id, email };
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
    = await bcrypt.hash(password, bcryptConfig.hash.saltOrRounds);

  const createdUser = await User.create({
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
