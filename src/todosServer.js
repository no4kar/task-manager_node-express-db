// @ts-check
'use strict';

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import swaggerUI from 'swagger-ui-express';

import { router as rootRouter } from './routers/root.router.js';
import { router as todoRouter } from './routers/todo.router.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { swaggerSpec } from './api-docs/swagger.js';

export const app = express();

// Use swagger-ui-express for your app documentation endpoint
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(cors());
app.use(express.json());

// Get all files from address
app.use('/', express.static(path.resolve('./public')));

// Routers
app.use('/', rootRouter);
app.use('/todos', todoRouter);

// Intercept of the errors
app.use(errorMiddleware);

// Unhandled errors
app.all('*', (req, res) => res.status(404).sendFile(path.resolve('./public/views/404.html')));
