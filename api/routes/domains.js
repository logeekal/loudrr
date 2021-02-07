const express = require("express");
const dbAdapter = require("../db/dbAdapter");

const db = new dbAdapter();

const router = express.Router();

/**
 * Authorized
 * insert email in the request
 *
 */
router.post("/", async (req, res) => {
  const {
    user: { email },
  } = req.session.passport;
  console.log(email);

  try {
    const domains = await db.getDomainsforUser(email);
    res.send(domains);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Authorized - insert email in request
 */
router.post("/pages", async (req, res) => {
  const { domainKey } = req.body;
  console.log(domainKey);

  try {
    const pagesWithComments = await db.getPagesForDomain(domainKey);
    res.send(pagesWithComments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**
 * Authorized
 * Req body should have email and domain address
 *
 */
router.post("/create", async (req, res) => {
  try {
    const { address: domainAddress } = req.body;
    const {
      user: { email },
    } = req.session.passport;
    console.log(domainAddress, email);
    const createdDomain = await db.createDomain(domainAddress, email);
    res.send(createdDomain);
  } catch (err) {
    res.send(400).send(err);
  }
});

module.exports = router;
