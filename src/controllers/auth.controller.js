'use strict';
// @ts-check

import { ApiError } from '../exceptions/apiError.js';
import { env } from '../configs/env.config.js';
import { jwtService } from '../services/jwt.service.js';
import { tokenService } from '../services/mongoose/token.service.js';
import { userService } from '../services/mongoose/user.service.js';
import { bcryptService } from '../services/bcrypt.service.js';
import { testByRegEx } from 'src/utils/helpers.js';

/**
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUser
 */

/**
 * @template {string} T1
 * @typedef {import('src/types/error.type.js').TyError.FailedReport<T1>} TyFailedReport
 */

export const authController = {
  register,
  activate,
  activateByGoogle,
  login,
  logout,
  refresh,
};

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function register(req, res) {
  const {
    email,
    password,
  } = req.body;

  /** @type {TyFailedReport<'email' | 'password'>} */
  const errors = {
    email: {
      isInvalid: !validateEmail(email),
      expected: '^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$',
      got: email,
    },
    password: {
      isInvalid: !validatePassword(password),
      expected: '^[A-Za-z0-9]{8}$',
      got: password,
    },
  };

  if (errors.email.isInvalid
    || errors.password.isInvalid) {
    throw ApiError.FailedReport(errors,
      'Validation error', ApiError.BadRequest);
  }

  await userService.register({
    email,
    password,
  }); // a thrown error will be caught by a "catchError()"

  res.send({ message: 'OK' });
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function activate(req, res) {
  const { activationToken } = req.params;

  const foundToken
    = await tokenService.getOneByOptions({
      activation: activationToken,
    });

  if (!foundToken) {
    throw ApiError.NotFound(
      `Can't find token by activation prop`,
      { details: { token: { activation: activationToken } } }
    );
  }

  const foundUser
    = await userService.getOneByOptions({
      id: foundToken.userId,
    });

  if (!foundUser) {
    throw ApiError.NotFound(
      `Can't find user by activationToken`);
  }

  await tokenService.update(
    foundToken,
    { activation: null },
  );

  await sendAuthentication(
    res,
    userService.toObject(foundUser),
  );
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function activateByGoogle(req, res) {
  /** @type {TyUser | null} */
  const user
    = req.user || null; // This is the user returned by Passport

  if (!user) {
    throw ApiError.Unauthorized('Google authentication failed');
  }

  const foundToken
    = await tokenService.getOneByOptions({
      userId: user.id,
    });

  if (!foundToken) {
    throw ApiError.Unauthorized('Google authentication failed');
  }

  res.redirect(`${env.todo.client.host}/task-manager_react-vite/activate/${foundToken.activation}`);
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function login(req, res) {
  const {
    email,
    password,
  } = req.body;
  const foundUser
    = await userService.getOneByOptions({ email });

  if (!foundUser) {
    throw ApiError.NotFound(
      'The user with this email does not exist'
    );
  }

  const foundToken
    = await tokenService.getOneByOptions({
      userId: foundUser._id,
    });

  if (!foundToken || foundToken.activation) {
    throw ApiError.Forbidden('The user is not yet activated');
  }

  const isPasswordValid
    = await bcryptService.compare(
      password,
      foundUser.password,
    );

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Login details are wrong');
  }

  await sendAuthentication(
    res,
    userService.toObject(foundUser),
  );
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function refresh(req, res) {
  const { refreshToken } = req.cookies;
  /** @type {TyUser | null} */
  const userData
    = jwtService.validateRefreshToken(refreshToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const token
    = await tokenService.getOneByOptions({
      refresh: refreshToken,
    });

  if (!token) {
    throw ApiError.Unauthorized();
  }

  const foundUser
    = await userService.getOneByOptions({
      email: userData.email,
    });

  if (!foundUser) {
    throw ApiError.Unauthorized();
  }

  await sendAuthentication(
    res,
    userService.toObject(foundUser),
  );
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function logout(req, res) {
  const { refreshToken } = req.cookies;
  /** @type {TyUser | null} */
  const userData
    = jwtService.validateRefreshToken(refreshToken);

  if (!userData) {
    throw ApiError.UnprocessableContent();
  }

  const foundToken
    = await tokenService.getOneByOptions({
      userId: userData.id,
    });

  if (!foundToken) {
    throw ApiError.NotFound(`Can't find token by userData.id`);
  }

  res.clearCookie('refreshToken');
  await tokenService.update(
    foundToken, {
    refresh: null,
  });

  res.sendStatus(204);
}

/** 
 * @param {import('express').Response} res
 * @param {import('src/types/user.type').TyUser.Item} user */
async function sendAuthentication(res, user) {
  const accessToken = jwtService.generateAccessToken(user);
  const refreshToken = jwtService.generateRefreshToken(user);
  const foundToken
    = await tokenService.getOneByOptions({
      userId: user.id,
    });

  if (!foundToken) {
    throw ApiError.NotFound(`Can't find token by user.id`);
  }

  await tokenService.update(
    foundToken,
    { refresh: refreshToken },
  );

  res.cookie(
    'refreshToken',
    foundToken.refresh, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none', // or 'strict'
    secure: !false, // Change to true in production with HTTPS
  });

  res.send({
    user: userService.normalize(user),
    accessToken,
  });
}

const validaterFor = Object.freeze({
  email: testByRegEx(/^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/),
  password: testByRegEx(/^[A-Za-z0-9]{8}$/),
});

/** @param {string} value */
function validateEmail(value) {
  return validaterFor.email(value);
  // if (!value) {
  //   return false;
  // }

  // const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  // if (!emailPattern.test(value)) {
  //   return false;
  // }

  // return true;
}

/** @param {string} value */
function validatePassword(value) {
  return validaterFor.password(value);
  // if (!value) {
  //   return false;
  // }

  // const passwordPattern = /^[A-Za-z0-9]{8}$/;

  // if (!passwordPattern.test(value)) {
  //   return false;
  // }

  // return true;
}
