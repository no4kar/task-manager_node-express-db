import {
  OAS3DefinitionPaths as todoOAS3DefinitionPaths,
} from '../api-docs/todo.paths.js';
import { todo as todoConfig } from '../configs/env.config.js';
import swaggerJSDoc from 'swagger-jsdoc';


// Swagger definition
/**@type {import('swagger-jsdoc').OAS3Definition} */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TASK MANAGER API',
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
      url: todoConfig.server.host,
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
          error: {
            type: 'string',
            description: 'Error stack',
          },
        },
        required: ['message', 'error'],
      },
    },
  },
  paths: {
    ...todoOAS3DefinitionPaths,
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
