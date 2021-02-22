const express = require("express");
const DbAdapter = require("../db/dbAdapter");
const bcrypt = require('bcrypt');

const db = new DbAdapter();

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

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).send("Mandatory field missing");
    return;
  }

  if(password.length < 8){
    res.status(400).send('Password should be at least 8 characters long.')
    return;
  }

  const passwordHash = bcrypt.hashSync(password,2);

  try {
    const createdUser = await db.createUser(email,name,passwordHash,'avatar');
    res.send(createdUser);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});



module.exports = router;

