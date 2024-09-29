import 'dotenv/config';

const serverPort = Number(process.env.SERVER_PORT || 3001);
const serverHost = process.env.SERVER_HOST || `http://localhost:${serverPort}`;

const clientPort = Number(process.env.CLIENT_PORT || 8080);
const clientHost = process.env.CLIENT_HOST || `http://localhost:${clientPort}`;

const JWTAccessSecret = process.env.JWT_ACCESS_SECRET || 'secretOrPrivateKey';
const JWTRefreshSecret = process.env.JWT_REFRESH_SECRET || 'secretOrPrivateKey';

const bcryptSaltOrRounds = Number(process.env.SALT_OR_ROUNDS) || 8;

const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpHost = process.env.SMTP_HOST || 'smtp.example.com';
const smtpUser = process.env.SMTP_USER || 'example@email.com';
const smtpPassword = process.env.SMTP_PASSWORD || 'example-password';

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

const mangodbUser = process.env.MANGO_USER || '';
const mangodbPassword = process.env.MANGO_PASSWORD || '';

const maxUnhandledRequestsPerIP = Number(process.env.MAX_UNHANDLED_REQUESTS_PER_IP) || 3;
const maxTotalUnhandledRequests = Number(process.env.MAX_TOTAL_UNHANDLED_REQUESTS) || 11;

export const env = Object.freeze({
  todo: {
    server: {
      port: serverPort,
      host: serverHost,
    },
    client: {
      port: clientPort,
      host: clientHost,
    },
  },
  jwt: {
    secret: {
      access: JWTAccessSecret,
      refresh: JWTRefreshSecret,
    },
  },
  bcrypt: {
    hash: {
      saltOrRounds: bcryptSaltOrRounds,
    },
  },
  smtp: {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser,
    password: smtpPassword,
  },
  google: {
    client: {
      id: googleClientId,
      secret: googleClientSecret,
    },
  },
  mangodb: {
    user: mangodbUser,
    password: mangodbPassword,
  },
  limit: {
    max: {
      unhandledRequestsPerIP: maxUnhandledRequestsPerIP,
      totalUnhandledRequests: maxTotalUnhandledRequests,
    },
  }
});

