// @ts-check
'use strict';

import bcrypt from 'bcrypt';

import { ApiError } from '../exceptions/api.error.js';
import { User } from '../models/User.model.js';
import { jwtService } from '../services/jwt.service.js';
import { tokenService } from '../services/token.service.js';
import { userService } from '../services/user.service.js';

export const authController = {
  register,
  activate,
  login,
  logout,
  refresh,
};

/** @type {import('src/types/func.type').Middleware} */
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

/** @type {import('src/types/func.type').Middleware} */
async function activate(req, res) {
  const { activationToken } = req.params;

  const foundUser = await User.findOne({
    where: { activationToken },
  });

  if (!foundUser) {
    throw ApiError.NotFound(`Can't find user by activationToken`);
  }

  Object.assign(foundUser, {
    ...foundUser.dataValues,
    activationToken: null,
  });

  await foundUser.save();

  await sendAuthentication(res, foundUser.dataValues);
}

/** @type {import('src/types/func.type').Middleware} */
async function login(req, res) {
  const { email, password } = req.body;
  const foundUser = await userService.getByEmail(email);

  if (!foundUser) {
    throw ApiError.BadRequest('The user with this email does not exist');
  }

  if (foundUser.dataValues.activationToken) {
    throw ApiError.BadRequest('The user is not yet activated');
  }

  const isPasswordValid
    = await bcrypt.compare(password, foundUser.dataValues.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Login details are wrong');
  }

  await sendAuthentication(res, foundUser.dataValues);
}

/** @type {import('src/types/func.type').Middleware} */
async function refresh(req, res) {
  const { refreshToken } = req.cookies;

  const userData = jwtService.validateRefreshToken(refreshToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const token = await tokenService.getByRefreshToken(refreshToken);

  if (!token) {
    throw ApiError.Unauthorized();
  }

  const user = await userService.getByEmail(userData?.email);

  if (!user) {
    throw ApiError.Unauthorized();
  }

  await sendAuthentication(res, user.dataValues);
}

/** @type {import('src/types/func.type').Middleware} */
async function logout(req, res) {
  const { refreshToken } = req.cookies;
  const userData = jwtService.validateRefreshToken(refreshToken);

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

  await tokenService.save({ userId: user.id, refreshToken });

  res.cookie('refreshToken', refreshToken, {
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

  if (value.length < 6) {
    return 'At least 6 characters';
  }
}
