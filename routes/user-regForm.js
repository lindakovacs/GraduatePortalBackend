const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");

const TempUser = require("../models/tempUser");
const User = require("../models/user");

const invalidResponse = (req, res, next) => {
  res.status(401).send({
    isSuccess: 0,
    message: "Invalid email or password",
    token: ""
  });
};

router.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).send({
      isSuccess: 0,
      message: "Invalid request",
      token: ""
    });
  }
  try {
    // Validate against temp user
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) return invalidResponse(req, res, next);

    const hash = tempUser.password.toString();
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) return invalidResponse(req, res, next);

    // Checks to see if user already exists
    const hasUser = await User.findOne({ email });
    if (hasUser) {
      return res.status(403).send({
        isSuccess: 0,
        message: `You have already registered. Please navigate to http://${
          req.headers.host
        }/login and login.`,
        token: ""
      });
    }

    // Create new user
    const user = new User({
      email,
      password: tempUser.password,
      isGrad: tempUser.isGrad
    });
    await user.save();

    // Generate token
    // TODO wishlist - tokens should expire
    // Add user ID to the token payload (timestamp added automatically)
    const token = jwt.sign({ sub: user._id.toString() }, config.jwtSecret);
    return res.status(200).send({
      isSuccess: 1,
      message: "Success",
      isGrad: user.isGrad,
      token
    });
  } catch(err) {
    serverError(req, res, next, err);
  }

});

router.all("/", methodNotAllowed);

module.exports = router;