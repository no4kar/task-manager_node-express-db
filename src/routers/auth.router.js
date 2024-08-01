'use strict';
// @ts-check

import express from 'express';
export const authRouter = express.Router();

import { authController } from '@src/controllers/auth.controller.js';
import { catchError } from '@src/middlewares/error.middleware.js';


authRouter.post('/registration', catchError(authController.register));
authRouter.get(
  '/activation/:activationToken',
  catchError(authController.activate),
);
authRouter.post('/login', catchError(authController.login));
authRouter.post('/logout', catchError(authController.logout));
authRouter.get('/refresh', catchError(authController.refresh));