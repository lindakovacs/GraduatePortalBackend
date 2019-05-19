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

router.put("/", async (req, res, next) => {

  // The View Profile and Search components are sending the ID as two different keys.
  // TODO: This should be fixed on the front-end at some point.
  const gradId = req.body._id || req.body.graduateId;

  let [github, linkedin, website] = normalizeUrls(
    req.body.github,
    req.body.linkedin,
    req.body.website,
  );
  
  try {

    const authUser = await User.findOne({ _id: req.user.sub });

    const grad = await Graduate.findById(gradId).populate("user");

    if (authUser.isGrad && (!grad.user || authUser._id.toString() !== grad.user._id.toString())) {
      const error = new Error("Not authorized");
      error.statusCode = 401;
      throw error;
    }

    grad.firstName = req.body.firstName;
    grad.lastName = req.body.lastName;
    grad.isActive = !!req.body.isActive;
    grad.phone = req.body.phone;
    grad.story = req.body.story;
    grad.yearOfGrad = req.body.yearOfGrad;
    grad.image = req.body.image;
    grad.resume = req.body.resume;
    grad.links.email = req.body.email;
    grad.links.github = github;
    grad.links.linkedin = linkedin;
    grad.links.website = website;
    grad.skills = req.body.skills;

    // Check if this grad has a user ref. If so, check whether the input email
    // matches the grad's user email. If it doesn't, make sure there are no
    // other users with the same email before assigning. (MongoDB will check
    // this for us, but we can give a more detailed error message this way.)
    // Finally, change user email to match grad email (if necessary).
    const gradUser = grad.user;
    if (gradUser) {
      if (gradUser.email !== req.body.email) {
        const userAlreadyExists = await User.findOne({ email: req.body.email });
        if (userAlreadyExists && userAlreadyExists._id.toString() !== gradUser._id.toString()) {
          const error = new Error("The email provided is already in use by another user");
          error.statusCode = 403;
          throw error;
        } else {
          gradUser.email = req.body.email;
          await gradUser.save();
        }
      }
    }

    const newGrad = await grad.save();

    res.status(200).send({
      isSuccess: 1,
      message: "Success",
      _id: newGrad._id.toString()
    });
  } catch(err) {
    switch (err.statusCode) {
      case 403:
      case 401:
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