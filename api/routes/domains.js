const express = require("express");
const dbAdapter = require("../db/dbAdapter");

const router = express.Router();

/**
 * Authorized
 * insert email in the request
 *
 */
router.post("/", async (req, res) => {
  const { email } = req.body();

  try {
    const domains = await dbAdapter.getDomainsforUser(email);
    res.send(domains);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Authorized - insert email in request
 */
router.post("/pages", async (req, res) => {
  const { key: domainKey } = req.body();

  try {
    const pagesWithComments = await dbAdapter.getPagesForDomain(domainKey);
    res.send(pagesWithComments);
  } catch (err) {
    res.status(500).send(err);
  }
});


/**
 * Authorized
 * Req body should have email and domain address
 * 
 */
 router.post("/create", async (req,res)=> {

    const {address: domainAddress, email} = req.body();

    try{
        const createdDomain =  await dbAdapter.createDomain(domainAddress,email);
        res.send(createdDomain);
    }catch(err){
        res.send(400).send(err)
    }
})


module.exports = router;