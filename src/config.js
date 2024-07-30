import 'dotenv/config';

const todosPort = process.env.TODOS_PORT || 3015;
const todosHost = process.env.TODOS_HOST || `http://localhost:${todosPort}`;
const JWTAccessSecret = process.env.JWT_ACCESS_SECRET || 'qwerty';
const JWTRefreshSecret = process.env.JWT_REFRESH_SECRET || 'qwerty';

export const todos = {
  server: {
    port: todosPort,
    host: todosHost,
  },
};

export const jwt = {
  secret: {
    access: JWTAccessSecret,
    refresh: JWTRefreshSecret,
  },
}