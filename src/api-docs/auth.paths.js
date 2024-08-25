import { responseError } from './responseError.js';

/**@type {import('swagger-jsdoc').OAS3Definition['paths']} */
export const OAS3DefinitionPaths =
{
  '/auth/login': {
    post: {
      summary: 'User Login',
      description:
        'Authenticates a user by verifying their email and password.\n\n'
        + '### Example Request\n'
        + '```http\n'
        + 'POST /auth/login\n'
        + 'Content-Type: application/json\n\n'
        + '{\n'
        + '  "email": "some@email.com",\n'
        + '  "password": "password"\n'
        + '}\n'
        + '```\n\n'
        + '### Responses\n'
        + '- **200 OK**: Successful login, returns user data and an access token, and sets a refresh token cookie.\n'
        + '- **401 Unauthorized**: Invalid email or password.\n'
        // + '- **422 Unprocessable Entity**: If the request body contains invalid data.\n'
        + '- **500 Internal Server Error**: For server issues.\n',
      tags: ['Auth'],
      requestBody: {
        description: 'The credentials required for logging in.',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'The email of the user attempting to log in.',
                  default: 'some@email.com',
                },
                password: {
                  type: 'string',
                  description: 'The password of the user attempting to log in.',
                  default: 'password',
                },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Successful login. Returns the authenticated user data and access token, and sets a refresh token in the cookies.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Auth',
              },
            },
          },
          headers: {
            'Set-Cookie': {
              description: 'Sets the refresh token with HttpOnly, Secure, and SameSite attributes.',
              schema: {
                type: 'string',
                example: `
                refreshToken=yourRefreshTokenHere;
                HttpOnly;
                Secure;
                SameSite=None;
                Path=/;
                Max-Age=2592000`,
              },
            },
          },
        },
        401: responseError[401],
        500: responseError[500],
      },
    },
  },
};
