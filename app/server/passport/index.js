const passport = require('passport');
const DbAdapter = require('../db/dbAdapter');
require('./local');
 require('./social');

const db = new DbAdapter();

passport.serializeUser((user,done)=> {
    // console.log(`Serializing : `,user)
    done(null, user);
})



passport.deserializeUser(async (email,done)=> {
    // console.log(`DeSerializing `, email)
    const user = await db.getUser(email);
    done(null, email)

})


module.exports = passport;