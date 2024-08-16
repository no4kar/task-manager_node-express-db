import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userService } from '../services/user.service.js';
import {
  google as googleConfig,
  todo as todoConfig,
} from './env.config.js';
import { bcryptService } from '../services/bcrypt.service.js';
import { ApiError } from '../exceptions/api.error.js';

passport.use(
  new GoogleStrategy(
    // options: StrategyOptions
    {
      clientID: googleConfig.client.id,
      clientSecret: googleConfig.client.secret,
      callbackURL: `${todoConfig.server.host}/auth/google/callback`,
    },
    // verify: (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => void
    async function (
      accessToken,
      refreshToken,
      profile,
      done,
    ) {
      try {
        // Check if the user already exists in the database
        const foundUser = await userService.getByOptions({
          email: profile.emails[0].value,
        });

        if (foundUser) {
          foundUser.setDataValue('activationToken', profile.id);
          await foundUser.save();

          return done(null, foundUser.dataValues);
        }

        // If user does not exist, create a new user with Google profile info
        const createdUser = await userService.create({
          email: profile.emails[0].value,
          password: await bcryptService.hash(profile.id),
          activationToken: profile.id,
        });

        return done(null, createdUser.dataValues);
      } catch (error) {
        return done(error, false);
      }
    },
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await userService.getByOptions({ id });

    if (!foundUser) throw ApiError.NotFound(`Can't find user by id`);;

    return done(null, foundUser.dataValues);
  } catch (error) {
    return done(error, false);
  }
});
