const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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
