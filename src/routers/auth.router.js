'use strict';
// @ts-check

import express from 'express';
export const authRouter = express.Router();

import { authController } from '../controllers/auth.controller.js';
import { catchError } from '../middlewares/error.middleware.js';

authRouter.get(
  '/activate/:activationToken',
  catchError(authController.activate),
);
authRouter.get('/refresh', catchError(authController.refresh));

authRouter.post('/registration', catchError(authController.register));
authRouter.post('/login', catchError(authController.login));
authRouter.post('/logout', catchError(authController.logout));
