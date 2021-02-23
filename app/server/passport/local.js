const LocalStrategy = require("passport-local").Strategy;
const DbAdapter = require("../db/dbAdapter");
const bcrypt = require("bcrypt");

const db = new DbAdapter();

const publicEndpoints = ["/domains/pages","/comments/thread","/comments"];

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, username, password, done) => {
    try {
      if(publicEndpoints.includes[req.originalUrl]){
        console.log('Got a public endpoints');
        return (done,{});
      }
      const existingUser = await db.getUser(username);
      console.log(existingUser);
      if (!existingUser) {
        console.log("existing user does not exists");
        return done(null, false, { message: "User does not exist" });
      }
      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isValidPassword) {
        console.log("Not a valid Password");
        return done(
          null,
          false,
          "Invalid Credentials. Username and password do not match"
        );
      }
      const { password: userPassword, ...userWithoutPassword } = existingUser;
      return done(null, userWithoutPassword);
    } catch (err) {
      console.log(err);
      return done(null, false, { message: err.message });
    }
  }
);

module.exports = localStrategy;
