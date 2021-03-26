const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ message: errors.array() });
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedpassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedpassword,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "user Created", id: result._id });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send({ message: "User with given email is not found." });
      }
      loadedUser = user;
      console.log("password", password);
      console.log("user.password", user.password);
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      console.log("isEqual", isEqual);
      if (!isEqual) {
        return res
          .status(401)
          .send({ message: "email or password is not found." });
      }
      const token = jwt.sign(
        { email: loadedUser.email, id: loadedUser._id.toString() },
        "longSecretKey",
        { expiresIn: "1h" }
      );
      res.status(200).send({ token, userId: loadedUser._id });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
