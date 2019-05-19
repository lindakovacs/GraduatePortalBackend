const express = require("express");
const router = express.Router();

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

    // Check to see if a graduate profile already exists with the supplied email.
    const profileAlreadyExists = await Graduate.findOne({ "links.email": `${grad.links.email}` });
    if (profileAlreadyExists) {
      const error = new Error(`A graduate profile already exists with this email: ${grad.links.email}.`);
      error.statusCode = 400;
      throw error;
    }

    // Add a "user" property if graduate is already a user. If the logged-in user
    // is a grad then this is the user ID that gets added. Otherwise we try to find
    // a user by matching the email from the form to one in the users collection.
    const loggedInUser = await User.findOne({ _id: req.user.sub });
    if (loggedInUser.isGrad) {
      grad.user = loggedInUser._id;
    } else {
      const gradUser = await User.findOne({ email: grad.links.email });
      if (gradUser) grad.user = gradUser._id;
    }

    const graduate = await grad.save();
    const graduateId = graduate._id;

    if (grad.user) {
      const user = await User.findOne({ _id: grad.user });
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
    if (err.statusCode === 400) {
      res.status(err.statusCode).send({
        isSuccess: 0,
        message: err.message
      });
    } else serverError(req, res, next, err);
  }
});

router.all("/", methodNotAllowed);

module.exports = router;