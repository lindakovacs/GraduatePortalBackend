const express = require("express");
const router = express.Router();

// const bcrypt = require("bcrypt");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const { auth, authErrorHandler } = require("../middleware/auth");

// const TempUser = require("../models/tempUser");
// const User = require("../models/user");


router.use(auth);
router.use(authErrorHandler);

router.post("/", async (req, res, next) => {

  try {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send({
      success: 1,
      retMessage: "Success"
    });
  } catch(err) {
    serverError(req, res, next, err);
  }

});

router.all("/", methodNotAllowed);

module.exports = router;