'use strict';
// @ts-check

/**
 * @typedef {import('src/types/user.type.js').TyUser.Item} TyUser
*/

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { env } from './env.config.js';
import { userService as usrSrv } from '../services/user.service.js';
import { bcryptService as bcrSrv } from '../services/bcrypt.service.js';
import { tokenService as tknSrv } from '../services/token.service.js';
import { ApiError } from '../exceptions/apiError.js';
import { logger } from '#src/utils/logger.js';

passport.use(
  new GoogleStrategy(
    // options: StrategyOptions
    {
      clientID: env.google.client.id,
      clientSecret: env.google.client.secret,
      callbackURL: `${env.todo.server.host}/auth/google/callback`,
    },
    // verify: (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => void
    async function (
      _unused_accessToken,
      _unused_refreshToken,
      profile,
      done,
    ) {
      try {

        if (!profile.emails?.length) {
          throw ApiError.UnprocessableContent(
            'Email is required in the profile.', {
            field: 'profile.emails[0].value',
            reason: 'Missing or empty',
          });
        }

        // Check if the user already exists in the database
        const foundUser
          = await usrSrv.getOneByOptions({
            email: profile.emails[0].value,
          });

        if (foundUser) {
          // if the token exists, it needs to update the attributes
          const foundToken
            = await tknSrv.put({
              userId: usrSrv.getValue(foundUser, 'id'),
              refresh: null,
              activation: profile.id,
            });

          if (!foundToken) {
            throw ApiError.NotFound(`Can't find token by user`);
          }

          return done(null, usrSrv.toObject(foundUser));
        }

        // If user does not exist, create a new user with Google profile info
        const createdUser
          = await usrSrv.create({
            email: profile.emails[0].value,
            password: await bcrSrv.hash(profile.id),
          });

        if (!createdUser) {
          throw ApiError.UnprocessableContent(
            'Google authentication failed');
        }

        const createdToken
          = await tknSrv.create({
            userId: /**@type {string}*/(usrSrv.getValue(createdUser, 'id')),
            refresh: null,
            activation: profile.id,
          });

        if (!createdToken) {
          throw ApiError.UnprocessableContent(
            'Google authentication failed');
        }

        return done(null, usrSrv.toObject(createdUser));
      } catch (error) {
        logger.error('Google Auth Error:', error); // Log error for debugging
        return done(error, false);
      }
    },
  )
);

passport.serializeUser((user, done) => {
  return done(null, /**@type {TyUser}*/(user).id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser
      = await usrSrv.getOneByOptions({ id });

    if (!foundUser) {
      throw ApiError.NotFound(`Can't find user by id`);
    }

    return done(null, usrSrv.toObject(foundUser));
  } catch (error) {
    return done(error, false);
  }
});
