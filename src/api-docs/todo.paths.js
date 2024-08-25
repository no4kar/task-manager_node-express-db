import { responseError } from './responseError.js';

/**@type {import('swagger-jsdoc').OAS3Definition['paths']} */
export const OAS3DefinitionPaths =
{
  '/todos/{id}': {
    get: {
      summary: 'Retrieve a todo by ID',
      description:
        'Fetch a single todo item by its **`id`**.\n' +
        'Use the `GET` method with the todo ID in the path.\n\n' +
        '### Example Request\n' +
        '```http\n' +
        'GET /todos/49894080-d3e4-11ee-8a1a-f51ed463b818\n' +
        '```\n\n' +
        '### Responses\n' +
        '- **200 OK**: Returns a single todo item.\n' +
        '- **404 Not Found**: If no todo matches the specified ID.\n' +
        '- **500 Internal Server Error**: For server issues.\n\n' +
        '[Learn more about error codes](https://example.com/errors)\n\n' +
        '![Todo Icon](https://example.com/todo-icon.png)\n\n' +
        '---\n' +
        '*Ensure authentication headers are included.*\n',
      tags: [
        'Todos'
      ],
      security: [
        {
          BearerAuth: [],
        }
      ],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'string'
          },
          required: true,
          description: 'The ID of the todo to retrieve'
        }
      ],
      responses: {
        200: {
          description: 'A single todo item',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Todo'
              }
            }
          }
        },
        401: responseError[401],
        404: responseError[404],
        500: responseError[500],
      }
    },
    put: {
      summary: 'Creating or replacing a todo',
      description:
        'Update a new todo item by providing the necessary details in the request body\n' +
        'and ID in the param.\n\n' +
        '### Example Request\n' +
        '```http\n' +
        'PUT /todos/49894080-d3e4-11ee-8a1a-f51ed463b818\n' +
        'Content-Type: application/json\n\n' +
        '{\n' +
        '  "userId": "12345",\n' +
        '  "title": "New Todo",\n' +
        '  "completed": false\n' +
        '}\n' +
        '```\n\n' +
        '### Responses\n' +
        '- **200 OK**: Returns a updated todo item.\n' +
        '- **201 OK**: Returns a created todo item.\n' +
        '- **422 Unprocessable Entity**: If invalid data is provided.\n' +
        '- **500 Internal Server Error**: For server issues.\n',
      tags: [
        'Todos'
      ],
      security: [
        {
          BearerAuth: [],
        }
      ],
      requestBody: {
        description: 'The details of the todo item to be created.',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  description: 'The userId associated with the todo',
                },
                title: {
                  type: 'string',
                  description: 'The title of the todo item',
                },
                completed: {
                  type: 'boolean',
                  description: 'The completion status of the todo item',
                  default: false,
                }
              },
              required: ['userId', 'title', 'completed'],
            }
          }
        }
      },
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'string'
          },
          required: true,
          description: 'The todo\'s ID',
        }
      ],
      responses: {
        200: {
          description: 'A updated todo item',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Todo'
              }
            }
          }
        },
        201: {
          description: 'A created todo item',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Todo'
              }
            }
          }
        },
        401: responseError[401],
        422: responseError[422],
        500: responseError[500],
      }
    },
    delete: {
      summary: 'Delete a todo',
      description:
        'Delete todo item by providing ID in the param.\n\n' +
        '### Example Request\n' +
        '```http\n' +
        'DELETE /todos/49894080-d3e4-11ee-8a1a-f51ed463b818\n' +
        '```\n\n' +
        '### Responses\n' +
        '- **200 OK**: Successfully deleted. Returns a number of deleted todo item.\n' +
        '- **404 Not Found**: The resource does not exist.\n' +
        '- **500 Internal Server Error**: For server issues.\n',
      tags: [
        'Todos'
      ],
      security: [
        {
          BearerAuth: [],
        }
      ],
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: {
            type: 'string'
          },
          required: true,
          description: 'The todo\'s ID',
        },
      ],
      responses: {
        200: {
          description: 'Successfully deleted',
          content: {
            'application/json': {
              name: 'count',
              schema: {
                type: 'number',
              },
            },
          },
        },
        404: responseError[404],
        500: responseError[500],
      }
    },
  },

  '/todos/': {
    get: {
      summary: 'Retrieve a list of todos',
      description:
        'Retrieve a list of all todos or todos by a specific user if `userId` is provided.\n\n' +
        '### Example Request\n' +
        '```http\n' +
        'GET todos/?page=1&size=2&userId=11967&title=asd&completed=true\n' +
        '```\n\n' +
        '### Responses\n' +
        '- **200 OK**: Returns all matched todos.\n' +
        '- **422 Unprocessable entity**: If invalid query.\n' +
        '- **500 Internal Server Error**: For server issues.\n',
      tags: ['Todos'],
      security: [
        {
          BearerAuth: [],
        }
      ],
      parameters: [
        {
          in: 'query',
          name: 'page',
          schema: {
            type: 'number'
          },
          required: true,
          description: 'The page'
        },
        {
          in: 'query',
          name: 'size',
          schema: {
            type: 'number'
          },
          required: true,
          description: 'The page\'s size'
        },
        {
          in: 'query',
          name: 'userId',
          schema: {
            type: 'string'
          },
          required: false,
          description: 'The ID of the user to retrieve todos for'
        },
        {
          in: 'query',
          name: 'title',
          schema: {
            type: 'string'
          },
          required: false,
          description: 'The title or part of the title'
        },
        {
          in: 'query',
          name: 'completed',
          schema: {
            type: 'boolean'
          },
          required: false,
          description: 'The completed status'
        }
      ],
      responses: {
        200: {
          description: 'A list of todos',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Pageable'
                }
              }
            }
          }
        },
        401: responseError[401],
        404: responseError[404],
        422: responseError[422],
        500: responseError[500],
      }
    },
    post: {
      summary: 'Create a todo',
      description:
        'Create a new todo item by providing the necessary details in the request body.\n\n' +
        '### Example Request\n' +
        '```http\n' +
        'POST /todos/\n' +
        'Content-Type: application/json\n\n' +
        '{\n' +
        '  "userId": "someUserId",\n' +
        '  "title": "New Todo",\n' +
        '  "completed": false\n' +
        '}\n' +
        '```\n\n' +
        '### Responses\n' +
        '- **201 Created**: Returns the created todo item.\n' +
        '- **422 Unprocessable Entity**: If invalid data is provided.\n' +
        '- **500 Internal Server Error**: For server issues.\n',
      tags: ['Todos'],
      security: [
        {
          BearerAuth: [],
        }
      ],
      requestBody: {
        description: 'The details of the todo item to be created.',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  description: 'The userId associated with the todo',
                },
                title: {
                  type: 'string',
                  description: 'The title of the todo item',
                },
                completed: {
                  type: 'boolean',
                  description: 'The completion status of the todo item',
                  default: false,
                }
              },
              required: ['userId', 'title'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'A created todo item',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Todo',
              },
            },
          },
        },
        401: responseError[401],
        422: responseError[422],
        500: responseError[500],
      },
    },
  },
};
