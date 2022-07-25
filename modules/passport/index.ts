var passport = require("passport");
import jwtStrategy from "./jwtStrategy";

passport.use("jwt", jwtStrategy);

passport.serializeUser((user: any, done: any) => done(null, user));
passport.deserializeUser((user: any, done: any) => done(null, user));

export default passport;
