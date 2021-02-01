const express = require("express");
const dbAdapter = require("../db/dbAdapter");
const bcrypt = require('bcrypt');

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
  }

  if(password.length < 8){
    res.status(400).send('Password should be at least 8 characters long.')
  }

  const passwordHash = bcrypt.hashSync(password,2);

  try {
    const createdUser = await dbAdapter.createUser(email,name,passwordHash,'avatar');
    res.send(200).send(createdUser);
  } catch (err) {
    res.status(500).send(err);
  }
});



module.exports = router;

