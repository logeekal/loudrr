const express = require("express");
const passport = require("passport");

const router = express.Router();


router.post('/',  async(req, res)=> {
    
    // console.log('In auth : ', req);
    console.log(req.session, req.isAuthenticated())

    if(!req.isAuthenticated()){
        res.sendStatus(401)
    }
    res.send(req.user);
})


//add password hashing middleware
router.post("/login", passport.authenticate('local'), async(req, res)=> {
    /**
     * 
     * req body: {
     *  email
     *  password
     * }
     */
    // const { email, password } = req.body();
    // if(!email, !password){
    //     res.status(400).send(`Either email or password is missing`);
    // }
    // try{
    //     const loggedInUser = await dbAdapter.loginUser(email, password);
    //     res.send(loggedInUser);
    // }catch(err){
    //     res.status(400).send(err);
    // }

    res.send(`Authenticated User : ${JSON.stringify(req.user)}`)
})





module.exports = router;