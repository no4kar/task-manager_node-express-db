import 'dotenv/config';
import { getFlagValues, execShell } from '../utils/helpers.js';

const serverPort
  = Number(process.env.SERVER_PORT || 3001);
const serverHost
  = process.env.SERVER_HOST
  || `http://${(await execShell('curl -s ipinfo.io/ip')).trim()}:${serverPort}`;

const clientPort
  = Number(process.env.CLIENT_PORT || 8080);
const clientHost
  = process.env.CLIENT_HOST
  || `http://localhost:${clientPort}`;

const JWTAccessSecret
  = process.env.JWT_ACCESS_SECRET
  || 'secretOrPrivateKey';
const JWTRefreshSecret
  = process.env.JWT_REFRESH_SECRET
  || 'secretOrPrivateKey';

const bcryptSaltOrRounds
  = Number(process.env.SALT_OR_ROUNDS)
  || 8;

const smtpPort
  = Number(process.env.SMTP_PORT || 587);
const smtpHost
  = process.env.SMTP_HOST
  || 'smtp.example.com';
const smtpUser
  = process.env.SMTP_USER
  || 'example@email.com';
const smtpPassword
  = process.env.SMTP_PASSWORD
  || 'example-password';

const googleClientId
  = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret
  = process.env.GOOGLE_CLIENT_SECRET || '';

const ormSolution
  = /**@type {'sequelize' | 'mongoose'}*/('mongoose'); // process.env.ORM_SOLUTION ||

const mangodbUser
  = process.env.MANGO_USER || '';
const mangodbPassword
  = process.env.MANGO_PASSWORD || '';

const postgresdbHost
  = process.env.POSTGRES_HOST || 'localhost';
const postgresdbPort
  = parseInt(process.env.POSTGRES_PORT || '5432', 10);
const postgresdb
  = process.env.POSTGRES_DB || 'postgres';
const postgresdbUsername
  = process.env.POSTGRES_USER || 'postgres';
const postgresdbPassword
  = process.env.POSTGRES_PASSWORD || '1111';

const maxUnhandledRequestsPerIP
  = Number(process.env.MAX_UNHANDLED_REQUESTS_PER_IP) || 3;
const maxTotalUnhandledRequests
  = Number(process.env.MAX_TOTAL_UNHANDLED_REQUESTS) || 11;

const logLevels
  = process.env.LOG_LEVELS
  || 'DEBUG,INFO,WARN,ERROR,JSON,DIR';

const logLevels = process.env.LOG_LEVELS || 'DEBUG,INFO,WARN,ERROR,JSON,DIR';

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
