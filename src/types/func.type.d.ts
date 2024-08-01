import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@src/exceptions/api.error';
import Sequelize from 'sequelize';

export declare namespace TyFunc {
  export {
    Middleware,
    ErrorMiddleware,
    SendAuth,
  }
}

// Type definition for a controller function
type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

// Type definition for an error-handling middleware function
type ErrorMiddleware = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

// Type definition for a function that sends authentication response
type SendAuth = (
  res: Response,
  user: Sequelize.Model
) => Promise<void>;
