import { todo as todoConfig } from './env.config.js';

/** @type {import('cors').CorsOptionsDelegate<import('cors').CorsRequest>} */
export const corsConfig = (req, cb) => {
  const corsOptions = {
    origin: todoConfig.client.host || req.headers.origin/* req.header('Origin') */, // Dynamically set the origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  cb(null, corsOptions);
}