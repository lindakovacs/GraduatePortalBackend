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

router.post("/", (req, res) => {

  let skillsRaw = req.body.skills.split(",");
  const skills = skillsRaw.map(skill => skill.trim());

  const grad = new Graduate({
    fistName: req.body.firstName,
    lastName: req.body.lastName,
    isActive: req.body.isActive,
    phone: req.body.phone,
    story: req.body.story,
    yearOfGrad: req.body.yearOfGrad,
    links: {
      github: req.body.github,
      linkedin: req.body.linkedin,
      website: req.body.website
    },
    image: req.body.image,
    resume: req.body.resume,
    skills,
    userId: req.body.user._id
  });

  grad.save()
    .then(result => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).send({
        success: 1,
        retMessage: "Success",
        graduateId: result.insertId
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
