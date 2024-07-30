// @ts-check
'use strict';

import express from 'express';
export const router = express.Router();

import * as todoController from '../controllers/todo.controller.js';
import { isAction } from '../middlewares/todo.middleware.js';
import { catchError } from '../middlewares/error.middleware.js';

router.get('/', catchError(todoController.get));
router.get('/:id', catchError(todoController.getById));

router.post('/', catchError(todoController.post));

router.put('/:id', catchError(todoController.put));

router.patch('/:id', catchError(todoController.patchById));
router.patch('/', isAction('delete'), catchError(todoController.removeMany));// chain of responsibility
router.patch('/', isAction('update'), catchError(todoController.updateMany));
router.patch('/', catchError(todoController.patchBulkUnknown));

router.delete('/:id', catchError(todoController.remove));
