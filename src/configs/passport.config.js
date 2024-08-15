import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userService } from '../services/user.service.js';
import {
  google as googleConfig,
  todo as todoConfig,
} from './env.config.js';
import { bcryptService } from '../services/bcrypt.service.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: googleConfig.client.id,
      clientSecret: googleConfig.client.secret,
      callbackURL: `${todoConfig.server.host}/auth/activateByGoogle`,
      // passReqToCallback: true,
    },
    async function (
      accessToken,
      refreshToken,
      profile,
      done,
    ) {
      console.dir({
        accessToken,
        refreshToken,
        profile,
      });

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
          // password: Math.random().toString(16).slice(2),
          activationToken: profile.id,
        });

        return done(null, createdUser.dataValues);
      } catch (error) {
        return done(error);
      }
    },
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await userService.getByOptions({ id });
    done(null, foundUser?.dataValues);
  } catch (error) {
    done(error);
  }
});
