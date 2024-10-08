import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userService } from '../services/mongoose/user.service.js';
import { env } from './env.config.js';
import { bcryptService } from '../services/bcrypt.service.js';
import { ApiError } from '../exceptions/api.error.js';

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
          await userService.update(foundUser, { activationToken: profile.id });

          return done(null, foundUser.toObject());
        }

        // If user does not exist, create a new user with Google profile info
        const createdUser = await userService.create({
          email: profile.emails[0].value,
          password: await bcryptService.hash(profile.id),
          activationToken: profile.id,
        });

        return done(null, createdUser.toObject());
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

    return done(null, foundUser.toObject());
  } catch (error) {
    return done(error, false);
  }
});
