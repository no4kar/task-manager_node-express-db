'use strict';
// @ts-check

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import passport from 'passport';
import './configs/passport.config.js';

import { rootRouter } from './routers/root.router.js';
import { todoRouter } from './routers/todo.router.js';
import { authRouter } from './routers/auth.router.js';

import { catchError, errorMiddleware } from './middlewares/error.middleware.js';
import { swaggerSpec } from './api-docs/swagger.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { corsConfig } from './configs/cors.config.js';
import { limiter } from './middlewares/limit.middleware.js';

export const app = express();

app.use(
  limiter,            // Rate limiter middleware
  cookieParser(),     // Parse cookies
  cors(corsConfig),   // Enable CORS
  express.json(),     // Parse JSON requests
  passport.initialize() // Initialize passport
);

// Get all files from address
app.use(express.static(path.resolve('./public')));

// Use swagger-ui-express for your app documentation endpoint
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routers
app.use('/', rootRouter);
app.use('/todos', catchError(authMiddleware), todoRouter);
app.use('/auth', authRouter);

// Intercept of the errors
app.use(errorMiddleware);

// Unhandled errors
app.all('*', (req, res) => res.status(404).sendFile(path.resolve('./public/views/404.html')));
