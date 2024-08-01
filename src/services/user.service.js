'use strict';
// @ts-check

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { emailService } from '@src/services/email.service.js';
import { ApiError } from '@src/exceptions/api.error.js';
import { User } from '@src/models/User.model.js';


export const userService = {
  /** @typedef {import('@src/types/user.type.js').TyUser.Item} TyUserItem */
  /** @typedef {import('@src/types/user.type.js').TyUser.ItemNormalized} TyUserItemNormalized */

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
  const user = await getByEmail(email);

  if (user) {
    throw ApiError.BadRequest('Validation error', {
      email: 'Email is already exist',
    });
  }

  // get activation token
  const activationToken = uuidv4();
  // hash the password
  const hash = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hash,
    activationToken,
  });

  await emailService.sendActivationLink(email, activationToken);
}

uuidv4();
