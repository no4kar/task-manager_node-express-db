'use strict';
// @ts-check

import express from 'express';
export const taskRouter = express.Router();

import { taskController } from '../controllers/task.controller.js';
import { catchError } from '../middlewares/error.middleware.js';

taskRouter
  .get('/:id', catchError(taskController.getById))
  .get('/', catchError(taskController.get))
  ;
