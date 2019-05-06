const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//Load validation
const validatePostInput = require("../../validation/post");

//@route    GET apis/posts/test
//@desc     Tests posts route
//@access   Public route
router.get("/test", (req, res) => res.json({ msg: "Posts response" }));

//@route    GET apis/posts
//@desc     Get Post
//@access   public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json("Could not get posts"));
});

//@route    GET apis/posts/:id
//@desc     Get Post by ID
//@access   public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ postnotfound: "Post does not exist" })
    );
});

//@route    POST apis/posts
//@desc     Create Post
//@access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route    DELETE apis/posts/:id
//@desc     Create Post
//@access   Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "Dont have permission" });
          }

          //Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ nopostfound: "Post does not exist" })
        );
    });
  }
);

//@route    POST apis/posts/like/:id
//@desc     Like post
//@access   Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString()).length > 0)
            return res
              .status(400)
              .json({ alreadyliked: "User has already liked this post" });
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ nopostfound: "Post does not exist" })
        );
    });
  }
);

//@route    POST apis/posts/unlike/:id
//@desc     Unlike post
//@access   Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString()).length === 0)
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });

          //Get the remove Index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //Slice
          post.likes.splice(removeIndex, 1);
          //Save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ nopostfound: "Post does not exist" })
        );
    });
  }
);

module.exports = router;
