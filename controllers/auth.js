const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ message: errors.array() });
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
};
