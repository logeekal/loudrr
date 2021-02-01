const LocalStrategy = require("passport-local").Strategy;
const dbAdapter = require("../db/dbAdapter");
const bcrypt =  require('bcrypt');

const localStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (username, password, done) => {
    try {
      const existingUser = await dbAdapter.getUser(username);
      if(!existingUser){
        console.log('existing user does not exists')
        return(null, false, {message: "User does not exist"});
      }
      const isValidPassword = await bcrypt.compare(password, existingUser.password);

      if(!isValidPassword){
        console.log('Not a valid Password')
        throw new Error('Invalid Credentials. Username and password do not match');
      }
      const { password: userPassword, ...userWithoutPassword}  = existingUser;
      return done(null, userWithoutPassword);
    } catch (err) {

      console.log(err)
      return done(null, false, { message: err.message });
    }
  }
);

module.exports = localStrategy;
