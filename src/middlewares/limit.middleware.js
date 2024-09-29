import { ApiError } from '../exceptions/api.error.js';
import { env } from '../configs/env.config.js';

// Middleware to track unhandled requests
const unhandledRequests = new Map();

/**
 * @type {import("src/types/func.type").Middleware} */
export function limiter(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.ip;

  console.info(`req.headers['x-forwarded-for'] || req.ip: ${ip}`);

  if (!unhandledRequests.has(ip)) {
    unhandledRequests.set(ip, 0);
  }

  const errors = {
    tooManyFromSameIP: unhandledRequests.get(ip) >= env.limit.max.unhandledRequestsPerIP,
    tooManyUnhandled: unhandledRequests.size >= env.limit.max.totalUnhandledRequests,
  };

  if (errors.tooManyFromSameIP || errors.tooManyUnhandled) {
    throw ApiError.TooManyRequests('Too many requests - try again later');
  }

  unhandledRequests.set(ip, unhandledRequests.get(ip) + 1);

  const decrementRequestCount = () => {
    if (res.locals.countDecremented) return;  // Check if the count has already been decremented
    res.locals.countDecremented = true;        // Set the flag to prevent future calls

    unhandledRequests.set(ip, unhandledRequests.get(ip) - 1);

    if (unhandledRequests.get(ip) === 0) {
      unhandledRequests.delete(ip);
    }
  };

  // Called when response is fully sent
  res.once('finish', decrementRequestCount);
  // Called if the client disconnects
  res.once('close', decrementRequestCount);

  next();
}
