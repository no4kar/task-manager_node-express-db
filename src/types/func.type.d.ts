import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/api.error';
import Sequelize from 'sequelize';
import type Mongoose from 'mongoose';

export declare namespace TyFunc {
  export {
    Middleware,
    ErrorMiddleware,
    SendAuth,
    MongooseSessionTransaction,
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

// Type definition for a wrap-function with session transaction for Mongoose actions
type MongooseSessionTransaction = <T>(
  cb: (session: Mongoose.ClientSession) => Promise<T>
) => Promise<T>;
