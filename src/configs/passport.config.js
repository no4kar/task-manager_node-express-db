import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userService } from '../services/user.service.js';
import { tokenService } from '../services/token.service.js';
import { jwtService } from 'src/services/jwt.service.js';
import {
  google as googleConfig,
  todo as todoConfig,
} from './env.config.js';

/**
 * @callback VerifyFunction
 * @param {string} accessToken - The access token.
 * @param {string} refreshToken - The refresh token.
 * @param {import('passport-google-oauth20').Profile} profile - The user's profile information.
 * @param {import('passport-google-oauth20').VerifyCallback} done - The callback function to indicate verification completion.
 * @returns {Promise<void>} */

passport.use(
  new GoogleStrategy(
    {
      clientID: googleConfig.client.id,
      clientSecret: googleConfig.client.secret,
      callbackURL: `${todoConfig.server.host}/auth/google/callback`,
      passReqToCallback: true,
    },
    /**@type {VerifyFunction} */
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        const foundUser = await userService.getByOptions({
          email: profile.emails[0].value,
        });

        if (foundUser) {
          return done(null, foundUser);
        }

        // If user does not exist, create a new user with Google profile info
        const createdUser = await userService.create({
          email: profile.emails[0].value,
          password: Math.random().toString(16).slice(2),
          // password: null, // No password required for Google OAuth2
          googleId: profile.id,
          // Add other profile fields as needed
        });

        // Generate JWT tokens for the authenticated user
        const accessToken = jwtService.generateAccessToken(user);
        const refreshToken = jwtService.generateRefreshToken(user);

        // Save the refresh token in the database
        await tokenService.save({ userId: user.id, refreshToken });

        // Attach the tokens to the user object so they can be used in the controller
        user.tokens = { accessToken, refreshToken };
        // Return the user for session handling
        return done(null, createdUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getByOptions({ id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
