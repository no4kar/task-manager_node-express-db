'use strict';
// @ts-check

import express from 'express';
export const authRouter = express.Router();
import passport from 'passport';

import { authController as authCntr } from '../controllers/auth.controller.js';
import { catchError } from '../middlewares/error.middleware.js';

authRouter
  .get('/refresh',
    catchError(authCntr.refresh),
  )
  .get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    }),
  )
  .get('/google/callback',
    passport.authenticate('google', { session: false }),
    catchError(authCntr.activateByGoogle), // here 'passport' attaches 'user' to 'req'
  )
  .get('/activate/:activationToken',
    catchError(authCntr.activate),
  )
  ;

authRouter
  .post('/registration', catchError(authCntr.register))
  .post('/login', catchError(authCntr.login))
  .post('/logout', catchError(authCntr.logout))
  ;
