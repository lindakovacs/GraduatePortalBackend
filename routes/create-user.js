const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const sendEmail = require("../services/sendEmail");

const User = require("../models/user");


router.post("/", async (req, res, next) => {

  const emails = req.body.emails;
  const isGrad = req.body.isGrad;

  try {
    // First, check that the user exists and is an admin.
    const user = await User.findOne({ _id: req.body.userId });

    if (!user)  {
      const error = new Error("No user found with that ID");
      error.statusCode = 404;
      throw error;
    }
    if (!user.isAdmin)  {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    // Create new users.
    emails.map(async email => {

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 12);
      const password = await bcrypt.hash(Math.random().toString(36).slice(-8), 12);

      // TODO: Import and run a function that puts an expiration on the temporary password.
      // Do we delete the user if the password expires? How to handle this?

      const newUser = new User({
        username: email,
        password,
        tempPassword: hashedPassword,
        isAdmin: !isGrad
      });

      await newUser.save();

      // If user is a grad, invite them to create a profile, else invite them to activate their admin account.
      if (isGrad) {
        const subject = "Invitation to join the AlbanyCanCode Graduate Portal";
        // TODO: Add url for href to graduate registration.
        const html = `
          <!DOCTYPE html>
          <html><head><meta charset="utf-8"></head><body>
          <form action="localhost:7003/api/graduates" method="GET" target="_blank">
          <p>Hello, AlbanyCanCode alum!</p>
          <p>You're invited to create a profile for the AlbanyCanCode graduate portal. The portal serves as a resource for local employers to view profiles, download resumes and visit links of ACC graduates.</p>
          <p>Your temporary password is:</p>
          <p><strong>${tempPassword}</strong></p>
          <p><small><em>NOTE: This password will expire in 48 hours.</em></small></p>
          <p>Please visit this <a href="https://www.cnn.com">link</a>  to login with your temporary password. You will then be directed to a form to create your new profile.</p>
          <p>Thank you!</p>
          <button type="submit" name="submit">Register</button>
          <input type="hidden" name="isGrad" value="${isGrad}"> 
          </form>
          </body></html>
        `;
        const mailInfo = await sendEmail(email, subject, html);
        console.log("Message sent: %s", mailInfo.messageId);
        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          success: 1,
          retMessage: "Success"
        });
      } else  {
        const subject = "Login to your AlbanyCanCode account";
        // TODO: Add url for href to admin activation.
        const html = `
          <!DOCTYPE html>
          <html><head><meta charset="utf-8"></head><body>
          <form action="localhost:7003/api/graduates" method="GET" target="_blank">
          <p>Hello, AlbanyCanCode admin!</p>
          <p>Please activate your admin account for the AlbanyCanCode graduate portal.</p>
          <p>Your temporary password is:</p>
          <p><strong>${tempPassword}</strong></p>
          <p><small><em>NOTE: This password will expire in 48 hours.</em></small></p>
          <p>Please visit this <a href="#">link</a> to login with your temporary password and activate your account.</p>
          <p>Thank you!</p>
          <button type="submit" name="submit">Activate</button>
          <input type="hidden" name="isGrad" value="${isGrad}"> 
          </form>
          </body></html>
        `;
        const mailInfo = await sendEmail(email, subject, html);
        console.log("Message sent: %s", mailInfo.messageId);
        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          success: 1,
          retMessage: "Success"
        });
      }

    });

  } catch (err) {
    serverError(req, res, next, err);
  }
});

router.all("/", methodNotAllowed);

module.exports = router;