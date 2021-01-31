const LocalStrategy = require("passport-local").Strategy;
const dbAdapter = require("../db/dbAdapter");

const localStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (username, password, done) => {
    try {
      const loggedInUser = await dbAdapter.loginUser(username, password);
      return done(null, loggedInUser);
    } catch (err) {
      return done(null, false, { message: err.message });
    }
  }
);

module.exports = localStrategy;
