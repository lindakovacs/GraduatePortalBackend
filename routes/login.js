const express = require("express");
const router = express.Router();

const methodNotAllowed = require("../errors/methodNotAllowed");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");

const User = require("../models/user");
const Graduate = require("../models/graduate");

const invalidResponse = (req, res, next) => {
  res.status(200).send({
    isSuccess: 0,
    message: "Invalid username or password",
    token: ""
  });
};

const serverError = (req, res, next, err) => {
  res.status(500).send({
    isSuccess: 0,
    message: "An unexpected error occurred",
    token: ""
  });
  next(err);
};

router.post("/", async (req, res, next) => {
  // Will this be refactored to email address on the front-end?
  const { username, password } = req.body;
  
  if (username === undefined || password === undefined) {
    res.status(400).send({
      isSuccess: 0,
      message: "Invalid request",
      token: ""
    });
    throw new Error("Invalid request");
  }

  // TODO figure out how to handle error without whole app crashing

  try {
    const user = await User.findOne({ email: username });

    // Invalid username
    if (!user) return invalidResponse(req, res, next);

    const hash = user.password.toString();
    bcrypt.compare(password, hash, async (err, isMatch) => {
      if (err) return serverError(req, res, next, err);

      if (isMatch) {
        // Valid credentials

        const graduate = await Graduate.findOne({ user: user._id });

        // TODO wishlist - tokens should expire
        // Add user ID to the token payload (timestamp added automatically)
        const token = jwt.sign({ sub: user._id.toString() }, config.jwtSecret);
        return res.status(200).send({
          isSuccess: 1,
          message: "Success",
          isGrad: user.isGrad,
          graduateId: graduate ? graduate._id.toString() : "",
          token
        });
        // Invalid password
      } else return invalidResponse(req, res, next);
    });
  } catch (err) {
    serverError(req, res, next, err);
  }
});

router.all("/", methodNotAllowed);

module.exports = router;
