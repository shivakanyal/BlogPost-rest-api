const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

createDate = () => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const today = new Date();
  return today.toLocaleDateString("en-US", options);
};

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .sort({ createdAt: -1 })
    // .countDocuments()
    // .then((count) => {
    //   totalItems = count;
    //   return Post.find()
    //     .skip((currentPage - 1) * perPage)
    //     .limit(perPage);
    // })
    .then((posts) => {
      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      res.status(404).send({ message: "failed to fetch posts" || err });
    });
};

exports.createPost = (req, res, next) => {
  // console.log("here is the effect of it.");
  const errors = validationResult(req);
  console.log("errors:", errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation is failed entered data is incorrect",
      errors: errors.array(),
    });
  }
  // if (!req.file) {
  //   return res.status(422).send({ message: "No image Provided!" });
  // }
  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const post = new Post({
    title: title,
    content: content,
    category: category,
    imageUrl: imageUrl,
    creatorName: req.user.name,
    creatorId: req.user.userId,
    date: createDate(),
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.user.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: post,
      });
    })
    .catch((err) => {
      return res.status(404).send({ message: "failed to save a post" || err });
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
  console.log("errors:", errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation is failed entered data is incorrect",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  let imageUrl = req.body.image;

  console.log("salaam body bhai.", req.body);
  console.log("salaam image bhai.", req.body.image);

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    return res.status(422).send({ message: "Image is not Provided.." });
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) return res.status(422).send({ message: "post is not found" });
      if (post.creatorId.toString() !== req.user.userId.toString()) {
        return res.status(422).send({ message: "not authorized." });
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      post.category = category;
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

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  let post, user;
  try {
    post = await Post.findById(postId);
    if (!post) {
      return res.status(421).send({ message: "Post is not found!" });
    }
    if (post.creatorId.toString() !== req.user.userId.toString()) {
      return res.status(422).send({ message: "not authorized." });
    }
    user = await User.findById(req.user.userId);
    user.posts.pull(post._id);
    await user.save();
    // Chekc for loggedin user
    clearImage(post.imageUrl);
    post = await Post.findByIdAndDelete(post._id);
    console.log("DeletedPost : ", post);
    res.status(200).send({ message: "Post is deleted successfully", post });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
