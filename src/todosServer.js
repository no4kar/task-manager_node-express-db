// @ts-check
'use strict';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import {
  router as todoRouter,
  OAS3DefinitionPaths as todoOAS3DefinitionPaths,
} from './routers/todo.router.js';
import { router as rootRouter } from './routers/root.router.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const PORT = process.env.TODOS_PORT || 3015; // eslint-disable-line
const HOST = process.env.TODOS_HOST || `http://localhost:${PORT}`; // eslint-disable-line

// Swagger definition
/**@type {swaggerJSDoc.OAS3Definition} */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TODOs API',
    version: '1.0.0',
    description:
      "### get('/')\n"
      + "### get('/:id')\n\n"
      + "### post('/')\n\n"
      + "### put('/:id')\n\n"
      // + "### patch('/:id')\n"
      // + "### patch('/', isAction('delete'))\n"
      // + "### patch('/', isAction('update'))\n\n"
      + "### delete('/:id')"
    ,
  },
  servers: [
    {
      url: HOST,
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      Todo: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The todo ID',
          },
          userId: {
            type: 'string',
            description: 'The ID of the user who owns the todo',
          },
          title: {
            type: 'string',
            description: 'The title of the todo',
          },
          // todo, inProgress, done
          completed: {
            type: 'boolean',
            description: 'Whether the todo is completed',
          },
        },
        required: ['id', 'userId', 'title', 'completed'],
      },
      Pageable: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'The count of the matched items',
          },
          content: {
            type: 'array',
            description: 'The todos found',
            items: {
              $ref: '#/components/schemas/Todo',
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
          },
        },
        required: ['message'],
      },
    },
  },
  paths: {
    ...todoOAS3DefinitionPaths,
  }
};

// Options for the swagger docs
/**@type {swaggerJSDoc.OAS3Options} */
const options = {
  apis: ['./src/routers/*.router.js'], // Path to the API docs
  swaggerDefinition,
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

const app = express();

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

export {
  app,
  PORT,
};
