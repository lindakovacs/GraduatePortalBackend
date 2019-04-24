const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const { auth, authErrorHandler } = require("../middleware/auth");
const config = require("../config");

const Graduate = require("../models/graduate");


router.use(auth);
router.use(authErrorHandler);

router.put("/", async (req, res, next) => {
  const handleServerError = serverError.bind(null, req, res, next);

  await mongoose.connect(config.mongoUri, { useNewUrlParser: true });
  let db = mongoose.connection;

  db.once("open", () => console.log("Connected to MongoDB"));
  db.on("error", err => console.log(err));
 
  // TODO: Refactor to async/await
  Graduate.findById(req.body._id)
    .then(grad => {
      // TODO: Add userId to request in app.js to allow additional backend auth
      // if (grad.userId.toString() !== req.body.userId.toString()) {
      //   const error = new Error('Not authorized');
      //   error.statusCode = 403;
      //   throw error;
      // }

      grad.firstName = req.body.firstName;
      grad.lastName = req.body.lastName;
      grad.isActive = req.body.isActive;
      grad.phone = req.body.phone;
      grad.story = req.body.story;
      grad.yearOfGrad = req.body.yearOfGrad;
      grad.image = req.body.image;
      grad.resume = req.body.resume;
      grad.links.email = req.body.email;
      grad.links.github = req.body.github;
      grad.links.linkedin = req.body.linkedin;
      grad.links.website = req.body.website;
      grad.skills = req.body.skills;

      return grad.save();
    })
    .then(grad => {
      res.status(200).send({
        isSuccess: 1,
        message: "Success",
        _id: grad._id
      });
    })
    .catch(handleServerError);
});

router.all("/", methodNotAllowed);

module.exports = router;