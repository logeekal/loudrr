const { RSA_NO_PADDING } = require("constants");
const express = require("express");
const passport = require("passport");
const { pass, redirect } = require("../passport/local");

const router = express.Router();

router.post("/", async (req, res, next) => {
  // console.log('In auth : ', req);
  console.log(req.session, req.isAuthenticated());

  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }
  if (req.user) {
    const { id, name, avatar } = req.user;
    res.send({ id, name, avatar });
  } else {
    res.sendStatus(401);
  }
  return;
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

router.get("/github", passport.authenticate("github"));
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/facebook", passport.authenticate("facebook",{authType: "reauthenticate", scope: ["public_profile","email"], display:"popup"}));



router.get(
  "/callback/github",
  passport.authenticate("github", { failureRedirect: "/login?result=fail" }),
  function (req, res) {
    console.log("Github login succcessfull");
    res.redirect('/login?result=success');
  }
);

router.get(
  "/callback/google",
  passport.authenticate("google", { failureRedirect: "/login?result=fail" }),
  function (req, res) {
    console.log("Google login succcessfull");
    res.redirect('/login?result=success');
  }
);
router.get(
  "/callback/facebook",
  passport.authenticate("facebook", { failureRedirect: "/login?result=fail" }),
  function (req, res) {
    console.log("FB login succcessfull");
    res.redirect('/login?result=success');
  }
);

module.exports = router;
