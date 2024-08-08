'use strict';
// @ts-check

import express from 'express';
export const authRouter = express.Router();

import { authController } from '../controllers/auth.controller.js';
import { catchError } from '../middlewares/error.middleware.js';

authRouter.get(
  '/activate/:activationToken',
  catchError(authController.activate),
);
authRouter.get('/refresh', catchError(authController.refresh));

authRouter.post('/registration', catchError(authController.register));
authRouter.post('/login', catchError(authController.login));
authRouter.post('/logout', catchError(authController.logout));

authRouter.use('/set-cookie', (req, res) => {
  res.cookie('someCookie', '789456123', {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    maxAge: 3600000 // 1 hour
  });
  res.json({ message: 'Cookie set successfully' });
});

// Route to get the cookie
authRouter.use('/get-cookie', (req, res) => {
  const cookie = req.cookies.someCookie;
  res.json({ message: `Cookie value: ${cookie}` });
});
