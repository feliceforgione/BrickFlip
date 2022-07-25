const Localstrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

function initialize(passport) {
  // Authentication Callback Function
  const authenticateUser = async (email, password, done) => {
    try {
      // Check if user exists with that email
      const user = await User.findOne({ _id: email });
      if (user == null) {
        return done(null, false, { message: "No user found" });
      }
      // Check that password is correct
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect email or password" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new Localstrategy({ usernameField: `email` }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const u = await User.findById(id);
    return done(null, u);
  });
}

module.exports = initialize;
