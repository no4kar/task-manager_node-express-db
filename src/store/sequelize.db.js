'use strict';
// @ts-check

import { Sequelize } from 'sequelize';
import { env } from '../configs/env.config.js';

/** @typedef {import('sequelize').Options} TySequelizeOptions*/

const options = (Object.freeze({
  /** @type {TySequelizeOptions}*/
  postgres: {
    dialect: 'postgres',
    host: env.postgresdb.host,
    port: env.postgresdb.port,
    database: env.postgresdb.database,
    username: env.postgresdb.username,
    password: env.postgresdb.password,
    logging: false,
  },
  
  /** @type {TySequelizeOptions}*/
  sqlite: {
    dialect: 'sqlite',
    storage: './src/db/db.sqlite',
  },
}))['postgres'];

export const sequelize
  = new Sequelize(options);
