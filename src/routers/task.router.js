'use strict';
// @ts-check

import express from 'express';
export const taskRouter = express.Router();

import { taskController as tskCntr } from '../controllers/task.controller.js';
import { catchError } from '../middlewares/error.middleware.js';

taskRouter
  .get('/:id', catchError(tskCntr.getById))
  .get('/', catchError(tskCntr.get));

taskRouter
  .post('/', catchError(tskCntr.post));

taskRouter
  .put('/:id', catchError(tskCntr.put));

taskRouter
  .delete('/:id', catchError(tskCntr.remove));