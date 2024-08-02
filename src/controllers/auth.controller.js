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

  const user = await User.findOne({
    where: { activationToken },
  });

  if (!user) {
    throw ApiError.NotFound(`Can't find user`);
  }

  user.activationToken = null;
  await user.save();

  await sendAuthentication(res, user);
}

/** @type {import('src/types/func.type').Middleware} */
async function login(req, res) {
  const { email, password } = req.body;
  const user = await userService.getByEmail(email);

  if (!user) {
    throw ApiError.BadRequest('User with this email does not exist');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Password is wrong');
  }

  await sendAuthentication(res, user);
}

/** @type {import('src/types/func.type').Middleware} */
async function refresh(req, res) {
  const { refreshToken } = req.cookies;
  const userData = jwtService.validateRefreshToken(refreshToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const token = await tokenService.getByToken(refreshToken);

  if (!token) {
    throw ApiError.Unauthorized();
  }

  const user = await userService.getByEmail(userData.email);

  await sendAuthentication(res, user);
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
  const userData = userService.normalize(user);
  const accessToken = jwtService.generateAccessToken(userData.id);
  const refreshToken = jwtService.generateRefreshToken(userData.id);

  await tokenService.save({ userId: user.id, refreshToken });

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.send({
    user: userData,
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
