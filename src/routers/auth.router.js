'use strict';
// @ts-check

import express from 'express';
export const authRouter = express.Router();
import passport from 'passport';

import { authController } from '../controllers/auth.controller.js';
import { catchError } from '../middlewares/error.middleware.js';

authRouter
  .get('/refresh',
    catchError(authController.refresh),
  )
  .get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    }),
  )
  .get('/google/callback',
    passport.authenticate('google', { session: false }),
    catchError(authController.activateByGoogle), // here 'passport' attaches 'user' to 'req'
  )
  .get('/activate/:activationToken',
    catchError(authController.activate),
  )
  ;

authRouter
  .post('/registration', catchError(authController.register))
  .post('/login', catchError(authController.login))
  .post('/logout', catchError(authController.logout))
  ;
