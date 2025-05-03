'use strict';
// @ts-check

import express from 'express';
export const todoRouter = express.Router();

import { todoController as tdCntr } from '../controllers/todo.controller.js';
import { isAction } from '../middlewares/todo.middleware.js';
import { catchError } from '../middlewares/error.middleware.js';

todoRouter
  .get('/', catchError(tdCntr.get))
  .get('/:id', catchError(tdCntr.getById));

todoRouter
  .post('/', catchError(tdCntr.post));

todoRouter
  .put('/:id', catchError(tdCntr.put));

todoRouter
  .patch('/:id', catchError(tdCntr.patchById))
  .patch('/', isAction('delete'), catchError(tdCntr.removeMany))// chain of responsibility
  .patch('/', isAction('update'), catchError(tdCntr.updateMany))
  .patch('/', catchError(tdCntr.patchBulkUnknown));

todoRouter
  .delete('/:id', catchError(tdCntr.remove));
