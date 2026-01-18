import 'dotenv/config';
import {
  getFlagValues,
  execShell,
  throwFunc,
} from '#utils/helpers.js';

const {
  SERVER_PORT,
  SERVER_HOST,

  CLIENT_PORT,
  CLIENT_HOST,

  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,

  SALT_OR_ROUNDS,

  CRYPTO_SALT,
  CRYPTO_IV,
  CRYPTO_SECRET,
  CRYPTO_ALGORITHM,

  SMTP_PORT,
  SMTP_HOST,
  SMTP_USER,
  SMTP_PASSWORD,

  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_EMPLOYEEDATA_SHEET_CREDENTIALS,

  MANGO_USER,
  MANGO_PASSWORD,

  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,

  MAX_UNHANDLED_REQUESTS_PER_IP,
  MAX_TOTAL_UNHANDLED_REQUESTS,

  ALLOWED_ORIGINS,
  ALLOWED_IPS,

  LOG_LEVELS,
} = process.env;

const serverPort
  = Number(SERVER_PORT || 3001);
const serverHost
  = SERVER_HOST
  || `http://${(await execShell(
    'curl -s ipinfo.io/ip',
    process.platform === 'linux' ? '/bin/bash' : undefined
  ))
    .trim()}:${serverPort}`;

const clientPort
  = Number(CLIENT_PORT || 8080);
const clientHost
  = CLIENT_HOST
  || `http://localhost:${clientPort}`;

const JWTAccessSecret
  = JWT_ACCESS_SECRET
  || throwFunc('JWT_ACCESS_SECRET');
const JWTRefreshSecret
  = JWT_REFRESH_SECRET
  || throwFunc('JWT_REFRESH_SECRET');

const bcryptSaltOrRounds
  = Number(SALT_OR_ROUNDS)
  || throwFunc(SALT_OR_ROUNDS);

const smtpPort = Number(SMTP_PORT || 587);
const smtpHost = SMTP_HOST || 'smtp.example.com';
const smtpUser = SMTP_USER || 'example@email.com';
const smtpPassword = SMTP_PASSWORD || 'example-password';

const googleClientId = GOOGLE_CLIENT_ID || '';
const googleClientSecret = GOOGLE_CLIENT_SECRET || '';

/**@type {'sequelize' | 'mongoose'}*/
const ormSolution
  = 'mongoose';

const mangodbUser
  = MANGO_USER || '';
const mangodbPassword
  = MANGO_PASSWORD || '';

const postgresdbHost
  = POSTGRES_HOST || 'localhost';
const postgresdbPort
  = parseInt(POSTGRES_PORT || '5432', 10);
const postgresdb
  = POSTGRES_DB || 'postgres';
const postgresdbUsername
  = POSTGRES_USER || 'postgres';
const postgresdbPassword
  = POSTGRES_PASSWORD || '1111';

const maxUnhandledRequestsPerIP
  = Number(MAX_UNHANDLED_REQUESTS_PER_IP) || 3;
const maxTotalUnhandledRequests
  = Number(MAX_TOTAL_UNHANDLED_REQUESTS) || 11;

const logLevels
  = LOG_LEVELS
  || 'DEBUG,INFO,WARN,ERROR,JSON,DIR';

export const env = Object.freeze({
  project: {
    server: {
      port: serverPort,
      host: serverHost,
      apiV: [
        '',
        '/api/v1',
      ]
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
  orm: {
    solution: ormSolution,
  },
  mangodb: {
    user: mangodbUser,
    password: mangodbPassword,
  },
  postgresdb: {
    host: postgresdbHost,
    port: postgresdbPort,
    database: postgresdb,
    username: postgresdbUsername,
    password: postgresdbPassword,
  },
  limit: {
    max: {
      unhandledRequestsPerIP: maxUnhandledRequestsPerIP,
      totalUnhandledRequests: maxTotalUnhandledRequests,
    },
  },
  flag: {
    mode: getFlagValues('--mode'),
  },
  logLevels:
    logLevels.toUpperCase()
      .split(/\s*[\,\.\s]\s*/g), /* eslint-disable-line no-useless-escape */
});
