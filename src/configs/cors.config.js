import { env } from './env.config.js';

/** @type {import('cors').CorsOptionsDelegate<import('cors').CorsRequest>} */
export const corsConfig = (req, cb) => {
  const corsOptions = {
    origin: env.todo.client.host || req.headers.origin/* req.header('Origin') */, // Dynamically set the origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // PUT, DELETE (these trigger preflight)
    allowedHeaders: ['Content-Type', 'Authorization'], // 'Authorization' (this triggers preflight)
    credentials: true,
    optionsSuccessStatus: 204, // Ensures preflight responses are handled properly
    maxAge: 86400, // Cache preflight response for 24 hours (reduces preflight requests)
  };

  cb(null, corsOptions);
}
