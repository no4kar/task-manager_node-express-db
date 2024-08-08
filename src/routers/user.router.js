'use strict';
// @ts-check

import express from 'express';
export const userRouter = express.Router();

import { userController } from '../controllers/user.controller.js';
import { catchError } from '../middlewares/error.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware';

userRouter.get('/',
  catchError(authMiddleware),
  catchError(userController.getAll),
);
