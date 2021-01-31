const express = require("express");
const passport = require("passport");
const dbAdapter = require("../db/dbAdapter");

const router = express.Router();


//add password hashing middleware
router.post("/login", passport.authenticate('local'), async(req, res)=> {
    /**
     * 
     * req body: {
     *  email
     *  password
     * }
     */
    const { email, password } = req.body();
    if(!email, !password){
        res.status(400).send(`Either email or password is missing`);
    }
    try{
        const loggedInUser = await dbAdapter.loginUser(email, password);
        res.send(loggedInUser);
    }catch(err){
        res.status(400).send(err);
    }

})

module.exports = router;