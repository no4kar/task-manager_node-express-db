import { Request, Response, NextFunction } from 'express';
import type Sequelize from 'sequelize';
import type Mongoose from 'mongoose';

import { ApiError } from '../exceptions/apiError';

export namespace TyFunc {
  // Type definition for a ApiError class
  export namespace ApiError {
    export type StaticMethod = (
      message?: string,
      errors?: Error | Object,
    ) => ApiError;
  }

  // Type definition for a controller function
  export type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void | Promise<void>;

  // Type definition for an error-handling middleware function
  export type ErrorMiddleware = (
    error: ApiError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void | Promise<void>;

  // Type definition for a function that sends authentication response
  export type SendAuth = (
    res: Response,
    user: Sequelize.Model
  ) => Promise<void>;

  // Type definition for a wrap-function with session transaction for Mongoose actions
  export type MongooseSessionTransaction = <T>(
    cb: (session: Mongoose.ClientSession) => Promise<T>
  ) => Promise<T>;
}

