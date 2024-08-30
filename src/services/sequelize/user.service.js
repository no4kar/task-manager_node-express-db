// @ts-check
'use strict';

import { v1 as uuidv1 } from 'uuid';

import { ApiError } from '../../exceptions/api.error.js';
import { User as Users } from '../../models/sequelize/User.model.js';
import { emailService } from '../email.service.js';
import { bcryptService } from '../bcrypt.service.js';

/** @typedef {import('src/types/user.type.js').TyUser.Item} TyUser */
/** @typedef {import('src/types/user.type.js').TyUser.ItemNormalized} TyUserNormalized */
/** @typedef {import('src/types/user.type.js').TyUser.ItemPartial} TyUserPartial */

export const userService = {
  normalize,
  getAllActive,
  getByOptions,
  getAndCountAllByOptions,
  create,
  register,
};

/** @param {TyUserNormalized} itemNormalized */
function normalize({ id, email }) {
  return { id, email };
}

function getAllActive() {
  return Users.findAll({
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

  return Users.findOne({
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

  return Users.findAndCountAll({
    where: whereConditions,
    limit,
    offset,
  });
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
