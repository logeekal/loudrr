const passport = require('passport');
const { getUser } = require('../db/dbAdapter');
const localStrategy = require('./local');

passport.use(localStrategy);

passport.serializeUser((user,done)=> {
    done(null, user.email);
})



passport.deserializeUser(async (email,done)=> {
    const user = await getUser(email);
})


module.exports = passport;