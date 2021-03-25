const { validationResult } = require("express-validator");
const Post = require("../models/post");
exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      if (!posts) {
        res.status(404).send({ message: "posts are not found!" });
      }
      res
        .status(200)
        .json({ posts, message: "posts are Fetcheds successfully." });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation is failed entered data is incorrect",
      errors: errors.array(),
    });
  }
  if (!req.file) {
    return res.status(422).send({ message: "No image Provided!" });
  }
  console.log("req.file", req.file);
  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "shiva" },
  });
  post.save().then((post) => {
    res
      .status(201)
      .json({
        message: "Post created successfully!",
        post: post,
      })
      .catch((err) => {
        res.status(404).send({ message: "failed to save a post" || err });
      });
  });
};

exports.getPost = (req, res, next) => {
  const id = req.params.postId;
  Post.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).send({ message: "post is not found." });
      }
      res.status(200).send({ message: "post fetched.", post });
    })
    .catch((err) => {
      res.status(500).send({ message: "Post is not found" });
    });
};
