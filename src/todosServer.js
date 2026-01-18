'use strict';
// @ts-check

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import passport from 'passport';
import '#configs/passport.config.js';

import { rootRouter } from '#routers/root.router.js';
import { todoRouter } from '#routers/todo.router.js';
import { taskRouter } from '#routers/task.router.js';
import { authRouter } from '#routers/auth.router.js';

import { env } from '#configs/env.config.js';
import { corsConfig } from '#configs/cors.config.js';
import { swaggerSpec } from './api-docs/swagger.js';
import { catchError, errorMiddleware } from '#middlewares/error.middleware.js';
import { authMiddleware } from '#middlewares/auth.middleware.js';
import { getLimiter } from '#middlewares/limit.middleware.js';

const {
  project: {
    server,
  }
} = env;

export const app = express();
const apiV1Router = express.Router();

// console.log('authRouter:', authRouter);
// console.log('todoRouter:', todoRouter);
// console.log('taskRouter:', taskRouter);

// Routers
apiV1Router
  .use('/todos', 
    catchError(authMiddleware), 
    todoRouter)
  .use('/tasks', 
    catchError(authMiddleware), 
    taskRouter)
  .use('/auth', authRouter)
  .use('/', rootRouter); // LAST

// --- Middlewares ---
app.use(
  getLimiter({
    unhandledRequestsPerIP: 3,
    totalUnhandledRequests: 7,
  }),       // Rate limiter middleware
  cookieParser(),     // Parse cookies
  cors(corsConfig),   // Enable CORS
  express.json(),     // Parse JSON requests
  passport.initialize() // Initialize passport
);

// --- API routes FIRST ---
app.use(server.apiV[1],
  apiV1Router);

// Use swagger-ui-express for your app documentation endpoint
app.use('/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec),
);


// --- Static files AFTER ---
// Get all files from address
app.use(express.static(path.resolve('./public')));
// Get all files from address
app.use('/images',
  express.static(path.resolve('./images'))
);

// --- Intercept of the errors ---
app.use(errorMiddleware);

// --- Unhandled errors ---
app.all('*',
  (_unused_req, res) => res.status(404).sendFile(
    path.resolve('./public/views/404.html')
  ),
);
