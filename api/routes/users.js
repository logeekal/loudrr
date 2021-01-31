const express = require("express");
const dbAdapter = require("../db/dbAdapter");

const router = express.Router();

// TODO add password and avatar middleware
router.post("/create", async (req, res) => {
  /**
   * POST body specs : {
   *  email
   *  password,
   *  name,
   * }
   */

  const { email, password, name } = req.body();

  if (!email || !password || !name) {
    res.status(400).send("Mandatory field missing");
  }
  try {
    const createdUser = await dbAdapter.createUser(email,name,password,'avatar');
    res.send(200).send(createdUser);
  } catch (err) {
    res.status(500).send(err);
  }
});


//add password hashing middleware
router.post("/login", async(req, res)=> {
    /**
     * 
     * req body: {
     *  email
     *  password
     * }
     */

    const { email, password } = req.body();
    if(!email, !password){
        res.status(401).send(`Either email or password is missing`);
    }
    try{
        const loggedInUser = await dbAdapter.loginUser(email, password);
        res.send(loggedInUser);
    }catch(err){
        res.status(401).send(err);
    }

})


