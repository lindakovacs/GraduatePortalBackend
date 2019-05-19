const express = require("express");
const router = express.Router();

const methodNotAllowed = require("../errors/methodNotAllowed");
const bcrypt = require("bcrypt");
const { auth, authErrorHandler } = require("../middleware/auth");

const User = require("../models/user");


router.use(auth);
router.use(authErrorHandler);

const serverError = (req, res, next, err) => {
  res.status(500).send({
    isSuccess: 0,
    message: "An unexpected error occurred"
  });
  next(err);
};

router.post("/", async (req, res, next) => {

  const newPassword = req.body.password;

  try {

    if (!newPassword) {
      const error = new Error("No password included in request");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ _id: req.user.sub });
    if (!user) {
      const error = new Error("Could not find the user in the database");
      error.statusCode = 404;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.setHeader("Content-Type", "application/json");
    res.status(200).send({
      success: 1,
      retMessage: "Success"
    });

  } catch(err) {
    switch (err.statusCode) {
      case 404:
      case 400:
        res.status(err.statusCode).send({
          isSuccess: 0,
          message: err.message
        });
        break;
      default:
        serverError(req, res, next, err);
    }
  }

});

router.all("/", methodNotAllowed);

module.exports = router;