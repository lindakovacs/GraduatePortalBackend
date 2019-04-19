const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const { config } = require("../config");

const Graduate = require("../models/graduate");


mongoose.connect(config.mongoUri, { useNewUrlParser: true });

router.get("/", (req, res, next) => {
  Graduate.find()
    .then(profiles => {
      res.status(200).send({
        isSuccess: 1,
        message: "Success",
        profiles
      });
    })
    .catch(err => serverError(req, res, next, err));
});

router.all("/", methodNotAllowed);

module.exports = router;
