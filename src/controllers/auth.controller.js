'use strict';
// @ts-check

import validator from 'validator';

import { ApiError } from '../exceptions/apiError.js';
import { env } from '#configs/env.config.js';
import { jwtService as jwtSrv } from '#services/jwt.service.js';
import { tokenService as tknSrv } from '#services/token.service.js';
import { userService as usrSrv } from '#services/user.service.js';
import { bcryptService as bcrSrv } from '#services/bcrypt.service.js';

/**
 * @typedef {import('src/types/func.type.js')
 * .TyFunc.Middleware
 * } TyFuncMiddleware
 * 
 * @typedef {import('src/types/func.type.js')
 * .TyFunc.AsyncMiddleware
 * } TyFuncAsyncMiddleware
 * 
 * @typedef {import('src/types/user.type.js')
 * .TyUser.Item
 * } TyUser
 */

/**
 * @template {string} T1
 * @typedef {import('src/types/error.type.js')
 * .TyError.FailedReport<T1>
 * } TyFailedReport
 */

export const authController = {
  register,
  activate,
  activateByGoogle,
  login,
  logout,
  refresh,
};

/** @type {TyFuncAsyncMiddleware} */
async function register(req, res) {
  const {
    email,
    password,
  } = req.body;

  /** @type {TyFailedReport<'email' | 'password'>} */
  const errors = {
    email: {
      isInvalid:
        !validator.matches(
          email,
          '^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$', // eslint-disable-line
          'i'),
      // isInvalid: !validateEmail(email),
      expected: /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/i,
      got: email,
    },
    password: {
      isInvalid:
        !validator.matches(
          password,
          '^[A-Za-z0-9]{8}$'),
      // isInvalid: !validatePassword(password),
      expected: /^[A-Za-z0-9]{8}$/,
      got: password,
    },
  };

  if (errors.email.isInvalid
    || errors.password.isInvalid) {
    throw ApiError.FailedReport(errors,
      'Validation error', ApiError.BadRequest);
  }

  await usrSrv.register({
    email,
    password,
  }); // a thrown error will be caught by a "catchError()"

  res.send({ message: 'OK' });
}

/** @type {TyFuncAsyncMiddleware} */
async function activate(req, res) {
  const { activationToken } = req.params;

  const foundToken
    = await tknSrv.getOneByOptions({
      activation: activationToken,
    });

  if (!foundToken) {
    throw ApiError.NotFound(
      `Can't find token by activation prop`,
      { details: { token: { activation: activationToken } } }
    );
  }

  const foundUser
    = await usrSrv.getOneByOptions({
      id: tknSrv.getValue(foundToken, 'userId'),
    });

  if (!foundUser) {
    throw ApiError.NotFound(
      `Can't find user by activationToken`);
  }

  await tknSrv.update(
    foundToken,
    { activation: null },
  );

  await sendAuthentication(
    res,
    usrSrv.toObject(foundUser),
  );
}

/** @type {TyFuncAsyncMiddleware} */
async function activateByGoogle(req, res) {
  const user
    = /** @type {TyUser | null} */ (req.user || null); // This is the user returned by Passport

  if (!user) {
    throw ApiError.Unauthorized('Google authentication failed');
  }

  const foundToken
    = await tknSrv.getOneByOptions({
      userId: user.id,
    });

  if (!foundToken) {
    throw ApiError.Unauthorized('Google authentication failed');
  }

  res.redirect(`${env.project.client.host}/task-manager_react-vite/activate/${tknSrv.getValue(foundToken, 'activation')}`);
}

/** @type {TyFuncAsyncMiddleware} */
async function login(req, res) {
  const {
    email,
    password,
  } = req.body;
  
  const foundUser
    = await usrSrv.getOneByOptions({ email });

  if (!foundUser) {
    throw ApiError.NotFound(
      'The user with this email does not exist'
    );
  }

  const foundToken
    = await tknSrv.getOneByOptions({
      userId: usrSrv.getValue(foundUser, 'id'),
    });

  if (!foundToken
    || tknSrv.getValue(foundToken, 'activation')) {
    throw ApiError.Forbidden('The user is not yet activated');
  }

  const isPasswordValid
    = await bcrSrv.compare(
      password,
      usrSrv.getValue(foundUser, 'password'),
    );

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Login details are wrong');
  }

  await sendAuthentication(
    res,
    usrSrv.toObject(foundUser),
  );
}

/** @type {TyFuncAsyncMiddleware} */
async function refresh(req, res) {
  const { refreshToken } = req.cookies;
  /** @type {TyUser | null} */
  const userData
    = /** @type {TyUser | null} */ (jwtSrv.validateRefreshToken(refreshToken));

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const token
    = await tknSrv.getOneByOptions({
      refresh: refreshToken,
    });

  if (!token) {
    throw ApiError.Unauthorized();
  }

  const foundUser
    = await usrSrv.getOneByOptions({
      email: userData.email,
    });

  if (!foundUser) {
    throw ApiError.Unauthorized();
  }

  await sendAuthentication(
    res,
    usrSrv.toObject(foundUser),
  );
}

/** @type {TyFuncAsyncMiddleware} */
async function logout(req, res) {
  const { refreshToken } = req.cookies;

  const userData
    = /** @type {TyUser | null} */ (jwtSrv.validateRefreshToken(refreshToken));
  /* Explicitly cast the return type of a function.
  Same like TS "const userData = jwtSrv.validateRefreshToken(refreshToken) as TyUser | null;" */


  if (!userData) {
    throw ApiError.UnprocessableContent();
  }

  const foundToken
    = await tknSrv.getOneByOptions({
      userId: userData.id,
    });

  if (!foundToken) {
    throw ApiError.NotFound(`Can't find token by userData.id`);
  }

  res.clearCookie('refreshToken');
  await tknSrv.update(
    foundToken, {
    refresh: null,
  });

  res.sendStatus(204);
}

/** 
 * @param {import('express').Response} res
 * @param {TyUser} user */
async function sendAuthentication(res, user) {
  const accessToken = jwtSrv.generateAccessToken(user);
  const refreshToken = jwtSrv.generateRefreshToken(user);
  const foundToken
    = await tknSrv.getOneByOptions({
      userId: user.id,
    });

  if (!foundToken) {
    throw ApiError.NotFound(`Can't find token by user.id`);
  }

  await tknSrv.update(
    foundToken,
    { refresh: refreshToken },
  );

  res.cookie(
    'refreshToken',
    tknSrv.getValue(foundToken, 'refresh'), {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none', // or 'strict'
    secure: !false, // Change to true in production with HTTPS
  });

  res.send({
    user: usrSrv.normalize(user),
    accessToken,
  });
}
