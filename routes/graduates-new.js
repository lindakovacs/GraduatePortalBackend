const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const methodNotAllowed = require("../errors/methodNotAllowed");
const { auth, authErrorHandler } = require("../middleware/auth");
const config = require("../config");

const Graduate = require("../models/graduate");


router.use(auth);
router.use(authErrorHandler);

router.post("/", async (req, res, next) => {

  // TODO: Add userId to request in auth.js.
  // const user = req.body.userId;

  const userId = mongoose.Types.ObjectId();

  const grad = new Graduate({
    fistName: req.body.firstName,
    lastName: req.body.lastName,
    isActive: req.body.isActive,
    phone: req.body.phone,
    story: req.body.story,
    yearOfGrad: req.body.yearOfGrad,
    resume: req.body.resume,
    image: req.body.image,
    // TODO: Refactor links?
    links: {
      email: req.body.email,
      github: req.body.github,
      linkedin: req.body.linkedin,
      website: req.body.website
    },
    skills: req.body.skills,
    // TODO: Add logic to make this the ID for the authorized user.
    userId
  });

  console.log("req.body.firstName = ", req.body.firstName);

  try {
    await mongoose.connect(config.mongoUri, { useNewUrlParser: true });
    let db = mongoose.connection;

    db.once("open", () => console.log("Connected to MongoDB"));
    db.on("error", err => console.log(err));

    console.log("From graduates-new. After assignment:", grad);

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
    const graduateId = graduate._id;
    console.log("From inside grad.save(). Save worked!");
    res.setHeader("Content-Type", "application/json");
    res.status(200).send({
      success: 1,
      retMessage: "Success",
      graduateId
    });
  } catch (err) {
    return res.status(500).send({
      isSuccess: 0,
      retMessage: "An unexpected error occurred"
    });
  }
});

router.all("/", methodNotAllowed);

module.exports = router;