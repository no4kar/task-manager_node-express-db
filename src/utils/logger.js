'use strict';
// @ts-check

import { env } from '../configs/env.config.js';
import { nopFunc } from './helpers.js';

/**
 * @enum {string} */
const LogLevel = {
  NONE: 'NONE',
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  JSON: 'JSON',
  DIR: 'DIR',
};

/**
 * Helper to check if a log level is enabled
 * @param {string} level
 * @returns {boolean} */
const isEnabled = (level) => env.logLevels.includes(level);

/**
 * Logger object with log methods based on log level
 * @type {{
 *   debug: (...args: any[]) => void,
 *   info: (...args: any[]) => void,
 *   warn: (...args: any[]) => void,
 *   error: (...args: any[]) => void,
 *   json: (arg: any) => void,
 *   dir: (arg: any) => void,
 * }} 
 * */
export const logger = Object.freeze({
  debug: isEnabled(LogLevel.DEBUG)
    ? (...args) => console.debug(...args)
    : nopFunc,

  info: isEnabled(LogLevel.INFO)
    ? (...args) => console.info(...args)
    : nopFunc,

  warn: isEnabled(LogLevel.WARN)
    ? (...args) => console.warn(...args)
    : nopFunc,

  error: isEnabled(LogLevel.ERROR)
    ? (...args) => console.error(...args)
    : nopFunc,

  json: isEnabled(LogLevel.JSON)
    ? (arg) => console.debug(JSON.stringify(arg, null, 2))
    : nopFunc,

  dir: isEnabled(LogLevel.DIR)
    ? (arg) => console.dir(arg, { depth: null, colors: true })
    : nopFunc,
});
