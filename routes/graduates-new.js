const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const { auth, authErrorHandler } = require("../middleware/auth");
const normalizeUrls = require("../services/normalizeUrls");

const Graduate = require("../models/graduate");
const User = require("../models/user");


router.use(auth);
router.use(authErrorHandler);

router.post("/", async (req, res, next) => {
  
  let [github, linkedin, website] = normalizeUrls(
    req.body.github,
    req.body.linkedin,
    req.body.website,
  );

  const grad = new Graduate({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    isActive: req.body.isActive,
    phone: req.body.phone,
    story: req.body.story,
    yearOfGrad: req.body.yearOfGrad,
    resume: req.body.resume,
    image: req.body.image,
    links: {
      email: req.body.email,
      github,
      linkedin,
      website
    },
    skills: req.body.skills
  });

  try {

    // Validate required fields.
    switch (true) {
      case !req.body.firstName.trim():
      case !req.body.lastName.trim():
      case (typeof req.body.isActive) !== "boolean":
      case !req.body.email.trim(): {
        const error = new Error("Encountered a problem with one or more of the required fields.");
        error.statusCode = 400;
        throw error;
      }
    }

    // Deny access if the authorized user already has a graduate profile.
    const authUser = await User.findById(req.user.sub);
    if (authUser.graduate) {
      const error = new Error("Action forbidden.");
      error.statusCode = 403;
      throw error;
    }

    // Use the supplied email to see if a graduate profile already exists.
    const profileAlreadyExists = await Graduate.findOne({ "links.email": `${grad.links.email}` });
    if (profileAlreadyExists) {
      const error = new Error(`A graduate profile already exists with this email: ${grad.links.email}.`);
      error.statusCode = 400;
      throw error;
    }

    // Add a "user" property if graduate is already a user. If the logged-in user
    // is a grad then this is the user ID that gets added. Otherwise we try to find
    // a user by matching the email from the form to one in the users collection.
    if (authUser.isGrad) {
      grad.user = authUser._id;
    } else {
      const gradUser = await User.findOne({ email: grad.links.email });
      if (gradUser) grad.user = gradUser._id;
    }

    const graduate = await grad.save();
    const graduateId = graduate._id;

    if (grad.user) {
      const user = await User.findById(grad.user);
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        user.password = hashedPassword;
      }
      user.graduate = graduateId;
      await user.save();
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).send({
      success: 1,
      retMessage: "Success",
      graduateId
    });

  } catch (err) {
    switch (err.statusCode) {
      case 403:
      case 401:
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