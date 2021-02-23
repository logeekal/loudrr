const { RSA_NO_PADDING } = require("constants");
const express = require("express");
const passport = require("passport");

const router = express.Router();

router.post("/", async (req, res, next) => {
  // console.log('In auth : ', req);
  console.log(req.session, req.isAuthenticated());

  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    next();
  }
  if (req.user) {
    const { id, name, avatar } = req.user;

    res.send({ id, name, avatar });
    next();
  } else {
    res.send(401);
    next();
  }
});

//add password hashing middleware
router.post("/login", passport.authenticate("local"), async (req, res) => {
  console.log("Got login request");
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

  const { id, name, avatar } = req.user;
  res.send({ id, name, avatar });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.send(200);
});

module.exports = router;
