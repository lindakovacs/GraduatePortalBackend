const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const sendEmail = require("../services/sendEmail");
const config = require("../config");

const User = require("../models/user");


router.post("/", async (req, res, next) => {

  const email = req.body.email;

  try {

    if (!email) {
      const error = new Error("No email included in request");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("No user with that email was found");
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign({ 
      sub: user._id.toString(),
      exp: Math.floor(Date.now() / 100) + 3600 
    }, config.jwtSecret);
    
    let failedToSend = "";
    try {
      let subject = "AlbanyCanCode graduate portal password reset";
      let text = `
        We received a password reset request for a user with this email address. If you did not request a password reset please disregard this message.
        Please visit the following link, or paste this into your browser to complete the process within one hour of receiving it:
        http://${req.headers.host}/user/reset-password/${token}
        Thank you! 
      `;
      let html = `
        <p>We received a password reset request for a user with this email address. If you did not request a password reset please disregard this message.</p>
        <p>Please visit the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
        <p><a href="http://${req.headers.host}/user/reset-password/${token}">http://${req.headers.host}/user/reset-password/${token}</a></p>
        <p>Thank you!</p>
      `;
      const mailInfo = await sendEmail(email, subject, text, html);
      console.log("Message sent: %s", mailInfo.messageId);
    } catch (err) {
      failedToSend += email;
    }

    if (failedToSend) {
      const err = new Error(`Oops! There was a problem sending an email to ${email}. This could be a configuration problem.`);
      err.statusCode = 501;
      throw err;
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).send({
      success: 1,
      retMessage: "Success"
    });
  } catch (err) {
    switch (err.statusCode) {
      case 404:
      case 400:
      case 501:
        res.status(err.statusCode).send({
          isSuccess: 0,
          message: err.message
        });
        break;
      default:
        serverError(req, res, next, err);
    }
  }
});

router.all("/", methodNotAllowed);

module.exports = router;