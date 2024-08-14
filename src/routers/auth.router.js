'use strict';
// @ts-check

import express from 'express';
export const authRouter = express.Router();
import passport from 'passport';

import { authController } from '../controllers/auth.controller.js';
import { catchError } from '../middlewares/error.middleware.js';

authRouter
  .get(
    '/activate/:activationToken',
    catchError(authController.activate),
  )
  .get('/refresh', catchError(authController.refresh))
  .get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      successRedirect: '/auth/google/callback',
      failureRedirect: '/auth/logout',
    })
  )
  .get('/google/callback',
    passport.authenticate('google', { session: false }),
    catchError(authController.googleAuthCallback)
  );

authRouter
  .post('/registration', catchError(authController.register))
  .post('/login', catchError(authController.login))
  .post('/logout', catchError(authController.logout));
