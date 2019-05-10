const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const sendEmail = require("../services/sendEmail");
const { auth, authErrorHandler } = require("../middleware/auth");

const TempUser = require("../models/tempUser");
const User = require("../models/user");


router.use(auth);
router.use(authErrorHandler);

router.post("/", async (req, res, next) => {

  const emails = req.body.emails;
  const isGrad = req.body.isGrad;

  try {

    // Authorize user as an admin.
    const user = await User.findOne({ _id: req.user.sub });
    if (user.isGrad)  {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    // Check whether emails already exist in the users database
    // before creating new users and sending notifications so that the
    // email array doesn't get partially processed before an error occurs.
    for (const email of emails) {
      const userExists = await User.findOne({ email });
      if (userExists)  {
        const error = new Error(`A user account with this email already exists: ${email}`);
        error.statusCode = 400;
        throw error;
      }
    }

    // Create users and send custom grad/admin messages. If the email already
    // exists in the tempUsers database the old temp user will be replaced.
    // Temporary users are automatically deleted from the database in 48 hrs.
    for (const email of emails) {
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 12);

      let tempUser = await TempUser.findOne({ email });
      if (tempUser) await tempUser.delete();
      tempUser = new TempUser({
        email,
        password: hashedPassword,
        isGrad
      });
      await tempUser.save();
      
      if (isGrad) {
        const subject = "Invitation to join the AlbanyCanCode Graduate Portal";
        const html = `
          <!DOCTYPE html>
          <html><head><meta charset="utf-8"></head><body>
          <p>Hello, AlbanyCanCode alum!</p>
          <p>You're invited to create a profile for the AlbanyCanCode graduate portal. The portal serves as a resource for local employers to view profiles, download resumes and visit links of ACC graduates.</p>
          <p>Your temporary password is:</p>
          <p><strong>${password}</strong></p>
          <p><small><em>NOTE: This password will expire in 48 hours.</em></small></p>
          <p>Please visit this <a href="${req.headers.host}">link</a> to login with your temporary password and activate your account. You will then be directed to a form to create your new profile.</p>
          <p>Thank you!</p>
          </body></html>
        `;
        const mailInfo = await sendEmail(email, subject, html);
        console.log("Message sent: %s", mailInfo.messageId);

      } else {
        const subject = "Login to your AlbanyCanCode account";
        const html = `
          <!DOCTYPE html>
          <html><head><meta charset="utf-8"></head><body>
          <form action="localhost:7003/api/graduates" method="GET" target="_blank">
          <p>Hello, AlbanyCanCode admin!</p>
          <p>Please activate your admin account for the AlbanyCanCode graduate portal.</p>
          <p>Your temporary password is:</p>
          <p><strong>${password}</strong></p>
          <p><small><em>NOTE: This password will expire in 48 hours.</em></small></p>
          <p>Please visit this <a href="${req.headers.host}/user/reg-form">link</a> to login with your temporary password and activate your account.</p>
          <p>Thank you!</p>
          </form>
          </body></html>
        `;
        const mailInfo = await sendEmail(email, subject, html);
        console.log("Message sent: %s", mailInfo.messageId);
      }
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).send({
      success: 1,
      retMessage: "Success"
    });
    
  } catch (err) {
    switch(err.statusCode) {
      case 403:
        res.status(403).send({
          isSuccess: 0,
          message: err.message
        });
        break;
      case 400:
        res.status(400).send({
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