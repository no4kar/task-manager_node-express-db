'use strict';
// @ts-check

import util from 'node:util';
import child_process from 'node:child_process';

/**
 * @template {string} T1
 * @typedef {import('#src/types/error.type.js').TyError.FailedReport<T1>} TyFailedReport
*/

/**
 * Returns a promise that resolves after a specified delay.
 * This function can be used to pause execution for a set amount of time.
 * 
 * @param {number} delay - The delay in milliseconds after which the promise resolves.
 * @returns {Promise<void>} A promise that resolves after the specified delay. */
export function wait(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

/**
 * Truncates a string to a specified maximum length and appends a specified string (e.g., '...') if truncation occurs.
 * If the string is shorter than or equal to the specified maximum length, it is returned unchanged.
 * 
 * @param {string} str - The target string to be truncated.
 * @param {number} maxLength - The maximum length of the truncated string including the fill string.
 * @param {string} [fillString=''] - The string to append to the truncated string (default is an empty string).
 * @returns {string} The truncated string with the fill string appended if truncation occurs. */
export function truncateString(
  str,
  maxLength,
  fillString = '',
) {
  if (str.length > maxLength) {
    // Regular expression to match all characters after the maxLength-fillString.length
    const regex = new RegExp(`^\\b(.{${maxLength - fillString.length}})`, 'm');
    return str.replace(regex, `$1${fillString}`).slice(0, maxLength);
  } else {
    return str;
  }
}

/**
 * Check if a variable is a natural number (a positive integer)
 * @param {number} val - The chaked value.
 * @returns {boolean} */
export function isNatural(val) {
  return Number.isInteger(val) && (val > 0)
}

/**
 * 
 * @param {RegExp} pattern -
 * @returns {(value: string) => boolean} */
export function testByRegEx(pattern) {
  return (value) => {
    if (!value) {
      return false;
    }

    if (!pattern.test(value)) {
      return false;
    }

    return true;
  }
}

/**
 * Extract specified properties from an object.
 * 
 * @param {Object} props - An object specifying which properties to extract (keys with any value).
 * @param {Object} from - The source object from which properties should be extracted.
 * @returns {Object} - An object containing only the extracted properties. */
export function extractProps(props, from) {
  return Object.keys(props)
    .reduce((acc, key) => {
      if (Object.prototype.hasOwnProperty.call(from, key)) {
        acc[key] = from[key];
      }
      return acc;
    }, {});
}

/**
 * Retrieves the value(s) associated with a given command-line flag.
 *
 * This function searches for the specified flag in the command-line arguments (`process.argv`) 
 * and extracts the values following it, stopping at the next flag or the end of the arguments.
 * 
 * Note: This implementation joins `process.argv` into a string and uses regex matching, 
 * meaning it may not correctly handle cases where arguments contain special characters or quotes.
 *
 * @param {string} [flag='--mode'] - The flag to search for (e.g., `--mode`).
 * @returns {string} - The matched value(s) as a single string, or an empty string if the flag is not found. */
export function getFlagValues(flag = '--mode') {
  const pattern = new RegExp(`${flag}\\s+(.*?)(?=$|\\s+\\-{1,})`);
  return process.argv
    .join(' ')
    .match(pattern)?.[1] || '';
}

/**
 * @param {object} targetObj
 * @param {object} sourceObj */
function findMatchProps(targetObj, sourceObj) {
  const result = {};

  for (const [targetKey, targetValue] of Object.entries(targetObj)) {
    if (!(targetKey in sourceObj)
      || typeof targetValue !== typeof sourceObj[targetKey]) {
      continue;
    }

    result[targetKey] = sourceObj[targetKey];
  }

  return Object.keys(result).length ? result : null;
}

/**
 * @param {object} targetObj
 * @param {object[]} sourceObjs */
export function findManyMatchProps(targetObj, sourceObjs) {
  return sourceObjs.map(compareObj => findMatchProps(targetObj, compareObj));
}


/**
 * Executes a terminal command asynchronously and returns the standard output.
 *
 * @async
 * @function execShell
 * @param {string} cmd - The terminal command to execute.
 * @param {'C:\\Program Files\\Git\\bin\\bash.exe'
 * | 'cmd.exe'
 * | 'powershell.exe'} [shell] - The command shell.
 * @returns {Promise<string>} The standard output from the executed command.
 * @throws {Error} If the command produces any error output (stderr).
 *
 * @example
 * const ip = await execShell('curl -s ipinfo.io/ip'); // Gets public IP address
 * const list = await execShell('ls -la'); // Runs custom command */
export async function execShell(
  cmd,
  shell = 'C:\\Program Files\\Git\\bin\\bash.exe',
) {
  const exec
    = util.promisify(child_process.exec);

  const {
    stdout,
    stderr
  } = await exec(cmd, { shell });

  if (stderr) {
    throw new Error(stderr);
  }

  return stdout;
}

/**
 * No-op function to disable logging in production
 * @returns {void} */
export function nopFunc() { }

/**
 * Throws an error with a given message.
 *
 * Useful in expressions to enforce required values by immediately throwing
 * if a condition is not met.
 *
 * @param {string} [message] - The error message to throw.
 * @throws {Error} Always throws an error with the provided message.
 * @returns {never} This function never returns; it always throws. */
export function throwFunc(message) {
  throw new Error(message);
}
