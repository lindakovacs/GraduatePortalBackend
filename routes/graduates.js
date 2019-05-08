const express = require("express");
const router = express.Router();

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");

const Graduate = require("../models/graduate");
const User = require("../models/user");


router.get("/", async (req, res, next) => {

  console.log("it worked!!!!");

  try {
    const profiles = await Graduate.find().populate("user");
    const updatedProfiles = profiles.map(grad => {
      const newGrad = { ...grad.toObject() };
      delete newGrad.user;
      newGrad.user = grad.user._id.toString();
      newGrad._id = grad._id.toString();
      newGrad.links.email = grad.user.username;
      return grad;
    });

    res.status(200).send({
      isSuccess: 1,
      message: "Success",
      profiles: updatedProfiles
    });

  } catch(err) {
    serverError(req, res, next, err);
  }

});

router.all("/", methodNotAllowed);

module.exports = router;
