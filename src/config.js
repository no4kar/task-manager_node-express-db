import 'dotenv/config';

const todosPort = process.env.TODOS_PORT || 3015;
const todosHost = process.env.TODOS_HOST || `http://localhost:${todosPort}`;

export const todos = {
  server: {
    port: todosPort,
    host: todosHost,
  },
};