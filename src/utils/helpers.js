/**
 * Returns a promise that resolves after a specified delay.
 * This function can be used to pause execution for a set amount of time.
 * 
 * @param {number} delay - The delay in milliseconds after which the promise resolves.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
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
 * @returns {string} The truncated string with the fill string appended if truncation occurs.
 */
export function truncateString(
  str,
  maxLength,
  fillString= '',
) {
  if (str.length > maxLength) {
    // Regular expression to match all characters after the maxLength-fillString.length
    const regex = new RegExp(`^\\b(.{${maxLength - fillString.length}})`,'m');
    return str.replace(regex, `$1${fillString}`).slice(0, maxLength);
  } else {
    return str;
  }
}

/**
 * Check if a variable is a natural number (a positive integer)
 * @param {number} val - The chaked value.
 * @returns {boolean}
 */
export function isNatural(val) {
  return Number.isInteger(val) && (val > 0)
}
