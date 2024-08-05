'use strict';
// @ts-check

import bcrypt from 'bcrypt';
import { v1 as uuidv1 } from 'uuid';

import { emailService } from '../services/email.service.js';
import { bcrypt as bcryptConfig } from '../config.js';
import { ApiError } from '../exceptions/api.error.js';
import { User } from '../models/User.model.js';

export const userService = {
  /** @typedef {import('src/types/user.type.js').TyUser.Item} TyUserItem */
  /** @typedef {import('src/types/user.type.js').TyUser.ItemNormalized} TyUserItemNormalized */

  getAllActive,
  normalize,
  getByEmail,
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

/**@param {TyUserItem['email']} email */
function getByEmail(email) {
  return User.findOne({
    where: { email },
  });
}

/** @param {TyUserItemNormalized} itemNormalized */
function normalize({ id, email }) {
  return { id, email };
}

/** @param {{email: string, password: string}} params */
async function register({ email, password }) {
  const foundUser = await getByEmail(email);

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
