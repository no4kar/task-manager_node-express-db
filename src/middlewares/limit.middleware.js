import { logger } from '#utils/logger.js';
import { ApiError } from '../exceptions/apiError.js';

/** 
* @param {Object} [options]
* @param {number} [options.unhandledRequestsPerIP]
* @param {number} [options.totalUnhandledRequests] */
export function getLimiter({
    unhandledRequestsPerIP = 3,
    totalUnhandledRequests = 11,
  } = {}) {
  // Middleware to track unhandled requests
  const unhandledRequests = new Map();

  /** @type {import("src/types/func.type.js").TyFunc.Middleware} */
  const limiter =
    function (req, res, next) {
      const ip = req.headers['x-forwarded-for'] || req.ip;

      if (!unhandledRequests.has(ip)) {
        unhandledRequests.set(ip, 0);
      }

      const errors = {
        tooManyFromSameIP:
          unhandledRequests.get(ip) >= unhandledRequestsPerIP,
        tooManyUnhandled:
          unhandledRequests.size >= totalUnhandledRequests,
      };

      if (errors.tooManyFromSameIP
        || errors.tooManyUnhandled) {
        throw ApiError.TooManyRequests(
          'Too many requests - try again later');
      }

      unhandledRequests.set(ip, unhandledRequests.get(ip) + 1);

      logger.info('\n\nSTART'
        + `\n\treq.headers['x-forwarded-for'] || req.ip: ${ip}`
        + `\n\tunhandledRequests.get(${ip}): ${unhandledRequests.get(ip)}`
        + `\n\tunhandledRequests.size: ${unhandledRequests.size}`
      );

      const decrementRequestCount = () => {
        if (res.locals.countDecremented) return;  // Check if the count has already been decremented
        res.locals.countDecremented = true;        // Set the flag to prevent future calls

        unhandledRequests.set(ip, unhandledRequests.get(ip) - 1);

        if (unhandledRequests.get(ip) === 0) {
          unhandledRequests.delete(ip);
        }

        logger.info('\nFINISH'
          + `\n\treq.headers['x-forwarded-for'] || req.ip: ${ip}`
          + `\n\tunhandledRequests.get(${ip}): ${unhandledRequests.get(ip)}`
          + `\n\tunhandledRequests.size: ${unhandledRequests.size}`
        );
      };

      // Called when response is fully sent
      res.once('finish', decrementRequestCount);
      // Called if the client disconnects
      res.once('close', decrementRequestCount);

      next();
    };

  return limiter;
}
