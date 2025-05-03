'use strict';
// @ts-check

import express from 'express';
export const userRouter = express.Router();

import { userController as usrCntr } from '../controllers/user.controller.js';
import { catchError } from '../middlewares/error.middleware.js';
import { authMiddleware as authMdwr } from '../middlewares/auth.middleware';

userRouter.get('/',
  catchError(authMdwr),
  catchError(usrCntr.getAll),
);
