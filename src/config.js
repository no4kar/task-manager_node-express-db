import 'dotenv/config';

const todosPort = Number(process.env.TODOS_PORT || 3015);
const todosHost = process.env.TODOS_HOST || `http://localhost:${todosPort}`;

const JWTAccessSecret = process.env.JWT_ACCESS_SECRET || 'secretOrPrivateKey';
const JWTRefreshSecret = process.env.JWT_REFRESH_SECRET || 'secretOrPrivateKey';

const bcryptSaltOrRounds = Number(process.env.SALT_OR_ROUNDS) || 8;

const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpHost = process.env.SMTP_HOST || 'smtp.example.com';
const smtpUser = process.env.SMTP_USER || 'example@email.com';
const smtpPassword = process.env.SMTP_PASSWORD || 'example-password';

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

export const bcrypt = {
  hash: {
    saltOrRounds: bcryptSaltOrRounds,
  },
}

export const smtp = {
  host: smtpHost,
  port: smtpPort,
  user: smtpUser,
  password: smtpPassword,
}
