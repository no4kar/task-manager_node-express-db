import {
  OAS3DefinitionPaths as todoOAS3DefinitionPaths,
} from './todo.paths.js';
import {
  OAS3DefinitionPaths as authOAS3DefinitionPaths,
} from './auth.paths.js';
import { env } from '../configs/env.config.js';
import swaggerJSDoc from 'swagger-jsdoc';


// Swagger definition
/**@type {import('swagger-jsdoc').OAS3Definition} */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TASK MANAGER API',
    version: '1.0.0',
    description:
      "### todoRouter\n"
      + '### get(\'/\')\n'
      + "\t### get('/:id')\n"
      + "\t### post('/')\n"
      + "\t### put('/:id')\n"
      // + "### patch('/:id')\n"
      // + "### patch('/', isAction('delete'))\n"
      // + "### patch('/', isAction('update'))\n\n"
      + "\n\t### delete('/:id')\n"

      + "### authRouter\n"
      + "\t### post('/login')\n"
    ,
  },
  servers: [
    {
      url: env.todo.server.host,
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
          completed: {
            type: 'boolean',
            description: 'Whether the todo is completed',
          },
        },
        required: ['id', 'userId', 'title', 'completed'],
      },
      User: {
        type: 'object',
        description: 'The authenticated user object',
        properties: {
          id: {
            type: 'string',
            description: 'The user ID',
          },
          email: {
            type: 'string',
            description: 'The user\'s email who owns the todos',
          },
        },
        // required: ['email'],
      },
      Auth: {
        type: 'object',
        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },
          accessToken: {
            type: 'string',
            description: 'The access token for the authenticated session',
          },
        },
        required: ['user', 'accessToken'],
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
          error: {
            type: 'string',
            description: 'Error stack',
          },
        },
        required: ['message', 'error'],
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        description:
          'Get JWT from auth/login and enter it here',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, just a hint for the format
      }
    },
  },
  paths: {
    ...todoOAS3DefinitionPaths,
    ...authOAS3DefinitionPaths,
  }
};

// Options for the swagger docs
/**@type {import('swagger-jsdoc').OAS3Options} */
const options = {
  apis: ['./src/routers/*.router.js'], // Path to the API docs if use JSDoc in file
  swaggerDefinition,
};

// Initialize swagger-jsdoc
export const swaggerSpec = swaggerJSDoc(options);
