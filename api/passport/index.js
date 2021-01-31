const passport = require('passport');
const { getUser } = require('../db/dbAdapter');
const localStrategy = require('./local');

passport.serializeUser((user,done)=> {
    console.log(`Serializing : ${user}`)
    done(null, user);
})



passport.deserializeUser(async (email,done)=> {
    console.log(`DeSerializing : ${email}`)
    const user = await getUser(email);
    done(null, email)

})


module.exports = passport;