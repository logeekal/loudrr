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

  const { email, password, name } = req.body;

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



module.exports = router;

