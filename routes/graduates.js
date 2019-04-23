const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const config = require("../config");

const Graduate = require("../models/graduate");

console.log("Checking connection from graduates.js:", config.mongoUri);
mongoose.connect(config.mongoUri, { useNewUrlParser: true });
const db = mongoose.connection;

// Check connection.
db.once("open", () => {
  console.log("Connected to MongoDB.");
});

// Check for db errors.
db.on("error", err => {
  console.log(err);
});

// TODO: Refactor to async/await
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
