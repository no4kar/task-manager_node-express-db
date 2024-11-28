'use strict';
// @ts-check

import { ApiError } from 'src/exceptions/api.error.js';
import { taskService } from '../services/mongoose/task.service.js';

export const taskController = {
  getById,
};

/** @type {import('src/types/func.type.js').Middleware} */
async function getById(req, res) {
  const { id } = req.params;
  const tasks = await taskService.getByOptions({ id });

  if (!tasks) {
    throw ApiError.NotFound();
  }

  res.send(tasks.map(item => taskService.normalize(taskService.toObject(item))));
}

// // By ID
// app.get('/tasks/:id', async (req, res) => {
//   const { id } = req.params;
//   const task = await taskService.getById(id);
//   if (!task) return res.status(404).send({ error: 'Task not found' });
//   res.send(task);
// });

// // By search parameters
// app.get('/tasks', async (req, res) => {
//   const { userId, name } = req.query;
//   const tasks = await taskService.getByOptions({ userId, name });
//   res.send(tasks);
// });
