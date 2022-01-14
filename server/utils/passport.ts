"use strict";
import passport from "koa-passport";
import { Strategy as PassportLocal } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import config from "../../config";
import User from "../models/User.model";
import PhantomPK from "../models/PhantomPK.model";

const deserializeAccount = async function (id: string, done) {
  try {
    const account = await User.findByPk(id, { include: PhantomPK });
    done(null, account);
  } catch (err) {
    done(err, false);
  }
};
const LocalStrategy = new PassportLocal(
  {
    usernameField: "phantomPk",
    passwordField: "phantomPk",
  },
  (key, pw, cb) => {
    PhantomPK.findByPk(key, { include: [{ model: User }] }).then(
      async (phantomAccount) => {
        deserializeAccount(phantomAccount.user.id, cb);
      }
    );
  }
);

passport.use("local", LocalStrategy);
passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.JWT_SECRET,
    },
    (payload, done) => {
      deserializeAccount(payload.userId, done);
    }
  )
);
passport.serializeUser((account: User, done) => {
  done(null, account.id);
});
passport.deserializeUser(deserializeAccount);

export default passport;
