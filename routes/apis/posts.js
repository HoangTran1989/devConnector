const express = require('express');
const router = express.Router();

//@route    GET apis/posts/test
//@desc     Tests posts route
//@access   Public route
router.get('/test', (req,res) => res.json({msg: "Posts response"}));

module.exports =  router;