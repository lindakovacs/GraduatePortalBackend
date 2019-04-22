const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const methodNotAllowed = require("../errors/methodNotAllowed");
const { auth, authErrorHandler } = require("../middleware/auth");
const config = require("../config");

const Graduate = require("../models/graduate");


mongoose.connect(config.mongoUri, { useNewUrlParser: true });

router.use(auth);
router.use(authErrorHandler);

// TODO: Refactor to async/await.

router.post("/", (req, res) => {

  const user = req.body.user;

  // TODO: Confirm skills are converted to array on front-end.
  // const skills = req.body.skills
  //   .split(",")
  //   .map(skill => skill.trim());

  const grad = new Graduate({
    fistName: req.body.firstName,
    lastName: req.body.lastName,
    isActive: req.body.isActive,
    phone: req.body.phone,
    story: req.body.story,
    yearOfGrad: req.body.yearOfGrad,
    resume: req.body.resume,
    image: req.body.image,
    email: req.body.email,
    // TODO: Refactor links?
    links: {
      github: req.body.github,
      linkedin: req.body.linkedin,
      website: req.body.website
    },
    skills: req.body.skills,
    userId: req.body.userId
  });


  grad.save()
    .then(result => Graduate.findOne({ user: user._id }))
    .then(graduate => {
      user.graduateId = graduate._id;
      return graduate;
    })
    .then(graduate => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).send({
        success: 1,
        retMessage: "Success",
        graduateId: graduate._id
      });
    })
    .catch(err => {
      return res.status(500).send({
        isSuccess: 0,
        retMessage: "An unexpected error occurred"
      });
    });

});

router.all("/", methodNotAllowed);

module.exports = router;