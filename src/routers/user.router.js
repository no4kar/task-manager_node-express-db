// @ts-check
'use strict';

import express from 'express';
export const router = express.Router();

import * as userController from '../controllers/todo.controller.js';
import { catchError } from '../middlewares/error.middleware.js';

router.get('/:id', catchError(userController.getById));

router.post('/', catchError(userController.post));

router.put('/:id', catchError(userController.put));

router.patch('/:id', catchError(userController.patchById));

router.delete('/:id', catchError(userController.remove));
