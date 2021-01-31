const e = require("express");
const express = require("express");
const dbAdapter = require("../db/dbAdapter");

const router = express.Router();

/**
 * Only Authorized
 */
router.post("/", async (req, res) => {
  //all the first level comments of a particular parent comment

  const { commentId: parentCommentId } = req.body();
  try {
    const comments = await dbAdapter.getFirstLevelChildComments(
      parentCommentId
    );
    res.send(comments);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Authorized
 */
router.post("/thread", async (req, res) => {
  const { commentId: parentCommentId } = req.body();

  try {
    const thread = await dbAdapter.getAllChildComments(parentCommentId);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 *
 * Add comments
 */

router.post("/add", async (req, res) => {
  try {
    const {
      commentId,
      mdText,
      status,
      email,
      url,
      title,
      domainKey,
    } = req.body();
    let createdComment = {};
    if (commentId) {
      createdComment = await dbAdapter.createChildComment(
        commentId,
        mdText,
        email,
        status
      );
    } else {
      createdComment = await dbAdapter.createParentComment(
        mdText,
        email,
        url,
        title,
        domainKey,
        status
      );
      res.send(createdComment);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


/**
 * Only commentId needed.
 */
router.put('/update',async (req, res)=> {

    const {commentId, status} = req.body();
    
    try{
        const updatedComment = await dbAdapter.updateCommentStatus(commentId, status);
        res.send(updatedComment);
    }catch(err){
        res.status(500).send(err);
    }


})
