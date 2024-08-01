'use strict';
// @ts-check

import express from 'express';
export const router = express.Router();

import { userController } from '@src/controllers/auth.controller.js';
import { catchError } from '@src/middlewares/error.middleware.js';
import { authMiddleware } from '@src/middlewares/auth.middleware';

router.get('/',
  catchError(authMiddleware),
  catchError(userController.getAll),
);
