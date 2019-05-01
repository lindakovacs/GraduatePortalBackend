const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const { auth, authErrorHandler } = require("../middleware/auth");
const normalizeUrls = require("../services/normalizeUrls");

const Graduate = require("../models/graduate");


router.use(auth);
router.use(authErrorHandler);

router.post("/", async (req, res, next) => {

  // TODO: Add userId to request in auth.js.
  // const user = req.body.userId;

  // TODO: Remove this code once we have a user on the request
  const userId = mongoose.Types.ObjectId();

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
    skills: req.body.skills,
    // TODO: Add logic to make this the ID for the authorized user.
    userId
  });

  try {
    // TODO: Add userId to graduate here??
    // TODO: Add graduateId to user if he/she is a graduate.
    // .then(result => Graduate.findOne({ user: user._id }))
    // .then(graduate => {
    //   user.graduateId = graduate._id;
    //   return graduate;
    // })
    // .then(graduate => {
    //   res.setHeader("Content-Type", "application/json");
    //   res.status(200).send({
    //     success: 1,
    //     retMessage: "Success",
    //     graduateId: graduate._id
    //   });
    // })
    await grad.save();
    const graduate = await Graduate.findOne({ userId });
    const graduateId = graduate._id.toString();

    res.setHeader("Content-Type", "application/json");
    res.status(200).send({
      success: 1,
      retMessage: "Success",
      graduateId
    });

  } catch (err) {
    serverError(req, res, next, err);
  }
});

router.all("/", methodNotAllowed);

module.exports = router;