const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

const cloudinary = require("../utils/cloudinary");
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

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log("errors:", errors.array());
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation is failed entered data is incorrect",
        errors: errors.array(),
      });
    }
    console.log("i am running 1");
    const { url, public_id } = await cloudinary.uploader.upload(req.file.path);
    // console.log("result inside cloudinary", result);
    const imageUrl = url;
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    let post = new Post({
      title: title,
      content: content,
      category: category,
      imageUrl: imageUrl,
      creatorName: req.user.name,
      creatorId: req.user.userId,
      public_id: public_id,
      date: createDate(),
    });
    console.log("i am running 2");

    await post.save();

    let user = await User.findById(req.user.userId);
    user.posts.push(post);
    await user.save();
    console.log("post", post);
    res.status(201).json({
      message: "Post created successfully!",
      post: post,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({ message: "some error occured." });
  }
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

exports.updatePost = async (req, res, next) => {
  try {
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

    let post = await Post.findById(postId);

    if (!post) return res.status(422).send({ message: "post is not found" });
    if (post.creatorId.toString() !== req.user.userId.toString()) {
      return res.status(422).send({ message: "not authorized." });
    }
    if (req.file) {
      clearImage(post.public_id);
      const { url, public_id } = await cloudinary.uploader.upload(
        req.file.path
      );
      imageUrl = url;
      post.public_id = public_id;
    }
    if (!imageUrl) {
      return res.status(422).send({ message: "Image is not Provided.." });
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    post.category = category;
    await post.save();
    return res
      .status(200)
      .json({ message: "post is updated successfully", res: post });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
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
    clearImage(post.public_id);
    post = await Post.findByIdAndDelete(post._id);
    console.log("DeletedPost : ", post);
    res.status(200).send({ message: "Post is deleted successfully", post });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const clearImage = (public_id) => {
  cloudinary.uploader.destroy(public_id, function (result) {
    console.log(result);
  });
};
