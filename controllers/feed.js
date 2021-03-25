const path = require("path");
const fs = require("fs");
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
        .json({ posts, message: "posts are Fetched successfully." });
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
  const postId = req.params.postId;
  Post.findById(postId)
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation is failed entered data is incorrect",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    return res.status(422).send({ message: "Image is not Provided.." });
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) return res.status(422).send({ message: "post is not found" });
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((post) => {
      res
        .status(200)
        .json({ message: "post is updated successfully", res: post });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(421).send({ message: "Post is not found!" });
      }
      // Chekc for loggedin user
      clearImage(post.imageUrl);
      Post.deleteOne(post).then((post) => {
        res.stauts(200).json({ message: "Post is deleted successfully", post });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
