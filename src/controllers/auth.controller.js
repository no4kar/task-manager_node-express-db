'use strict';
// @ts-check

import { ApiError } from '../exceptions/api.error.js';
import { jwtService } from '../services/jwt.service.js';
import { tokenService } from '../services/mongoose/token.service.js';
import { userService } from '../services/mongoose/user.service.js';
import { bcryptService } from '../services/bcrypt.service.js';
import { env } from '../configs/env.config.js';

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
  const { email, password } = req.body;

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email || errors.password) {
    throw ApiError.BadRequest('Validation error', errors);
  }

  await userService.register({ email, password }); // a thrown error will be caught by a "catchError()"

  res.send({ message: 'OK' });
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function activate(req, res) {
  const { activationToken } = req.params;

  const foundTokens
    = await tokenService.getByOptions({
      activation: activationToken,
    });

  if (foundTokens.length > 1) { // Some
    throw ApiError.Conflict(
      `Expected only one instance, but multiple were found.`,
      { details: { instancesFound: 3 } }
    );
  }

  const foundToken = foundTokens.at(0);

  if (!foundToken) {
    throw ApiError.NotFound(
      `Can't find userId by activationToken`,
      { details: { activationToken } }
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
  /** @type {import('src/types/user.type').TyUser.Item | null} */
  const user = req.user || null; // This is the user returned by Passport

  if (!user) {
    throw ApiError.Unauthorized('Google authentication failed');
  }

  const foundToken
    = await tokenService.getByOptions({ userId: user.id });

  if (!foundToken) {
    throw ApiError.Unauthorized('Google authentication failed');
  }

  res.redirect(`${env.todo.client.host}/task-manager_react-vite/activate/${foundToken.activation}`);
}

/** @type {import('src/types/func.type.js').TyFunc.Middleware} */
async function login(req, res) {
  const { email, password } = req.body;
  const foundUser = await userService.getOneByOptions({ email });

  if (!foundUser) {
    throw ApiError.NotFound('The user with this email does not exist');
  }

  const foundToken
    = await tokenService.getOneByUserId(foundUser._id);

  if (!foundToken || foundToken.activation) {
    throw ApiError.Forbidden('The user is not yet activated');
  }

  const isPasswordValid
    = await bcryptService.compare(password, foundUser.password);

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

  const userData
    = jwtService.validateRefreshToken(refreshToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const token
    = await tokenService.getByRefreshToken(refreshToken);

  if (!token) {
    throw ApiError.Unauthorized();
  }

  const foundUser
    = await userService.getOneByOptions({ email: userData.email });

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
  const userData
    = jwtService.validateRefreshToken(refreshToken);

  res.clearCookie('refreshToken');

  if (userData) {
    await tokenService.remove(userData.id);
  }

  res.sendStatus(204);
}

/** 
 * @param {import('express').Response} res
 * @param {import('src/types/user.type').TyUser.Item} user */
async function sendAuthentication(res, user) {
  const accessToken = jwtService.generateAccessToken(user);
  const refreshToken = jwtService.generateRefreshToken(user);
  const foundToken = await tokenService.getOneByUserId(user.id);

  if (!foundToken) {
    throw ApiError.NotFound(`Can't find token by user.id`);
  }

  await tokenService.update(
    foundToken,
    { refresh: refreshToken },
  );

  res.cookie('refreshToken', foundToken.refresh, {
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

/** @param {string} value */
function validateEmail(value) {
  if (!value) {
    return 'Email is required';
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!emailPattern.test(value)) {
    return 'Email is not valid';
  }
}

/** @param {string} value */
function validatePassword(value) {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 8) {
    return 'At least 8 characters';
  }
}
