const express = require("express");
const router = express.Router();

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");

const Graduate = require("../models/graduate");


router.get("/", async (req, res, next) => {

  try {
    const profiles = await Graduate.find();
    const updatedProfiles = profiles.map(grad => {
      const newGrad = { ...grad.toObject() };
      newGrad._id = grad._id.toString();
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
