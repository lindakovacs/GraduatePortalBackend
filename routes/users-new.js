const express = require("express");
const router = express.Router();

const dns = require("dns");

const bcrypt = require("bcrypt");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const sendEmail = require("../services/sendEmail");
const { auth, authErrorHandler } = require("../middleware/auth");

const TempUser = require("../models/tempUser");
const User = require("../models/user");


const arrayToString = arr => {
  if (arr.length > 1) {
    return arr.slice(0, -1).join(", ") + " and " + arr.slice(-1);
  } else {
    return arr.join("");
  }
};

const validateDomainName = emailAddress => {
  const hostName = emailAddress.split("@")[1];
  return new Promise(resolve => {
    dns.lookup(hostName, err => {
      resolve({ isValid: !err });
    });
  });
};

router.use(auth);
router.use(authErrorHandler);

router.post("/", async (req, res, next) => {

  const { emails, isGrad } = req.body;

  try {

    // Validate request data.
    let inputErrMsg;
    switch (true) {
      case !emails :
      case !emails[0] :
        inputErrMsg = "No emails included in request";
        break;
      case !Array.isArray(emails) :
        inputErrMsg = "Emails were not sent as an array";
        break;
      case req.body.isGrad === undefined :
        inputErrMsg = "No value for isGrad included in request";
        break;
      case typeof isGrad !== "boolean" :
        inputErrMsg = "Value for isGrad was not sent as a boolean";
        break;
      default :
        inputErrMsg = "";
    }

    if (inputErrMsg) {
      const error = new Error(inputErrMsg);
      error.statusCode = 400;
      throw error;
    }

    // Authorize user as an admin.
    const user = await User.findOne({ _id: req.user.sub });


    if (user.isGrad) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    // Find and separate out any emails that already exist in users database.
    const dupeEmails = [];
    for (const email of emails) {
      const userExists = await User.findOne({ email });
      if (userExists) dupeEmails.push(email);
    }
    let dupeEmailsStr = arrayToString(dupeEmails);
    const nonDupeEmails = emails.filter(email => !(dupeEmails.includes(email)));

    // Validate email format and domain existence. 
    const invalidEmails = [];
    for (let email of nonDupeEmails) {
      const emailFormatRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailFormatRegex.test(email)) {
        invalidEmails.push(email);
      } else {
        const domainName = await validateDomainName(email);
        if (!domainName.isValid) {
          invalidEmails.push(email);
        }
      }
    }
    let invalidEmailsStr = arrayToString(invalidEmails);
    const validEmails = nonDupeEmails.filter(email => !(invalidEmails.includes(email)));
    let validEmailsStr = arrayToString(validEmails);


    // Create users only for valid emails not already existing in users database.
    // Send custom grad/admin messages. If the email already
    // exists in the tempUsers database the old temp user will be replaced.
    // Temporary users are automatically deleted from the database in 48 hrs.
    const failedToSend = [];
    for (const email of validEmails) {
      const password = Math.random()
        .toString(36)
        .slice(-8);
      const hashedPassword = await bcrypt.hash(password, 12);

      let tempUser = await TempUser.findOne({ email });
      if (tempUser) await tempUser.delete();
      tempUser = new TempUser({
        email,
        password: hashedPassword,
        isGrad
      });
      await tempUser.save();
      
      try {
        let subject, text, html;
        if (isGrad) {
          subject = "Invitation to join the AlbanyCanCode Graduate Portal";
          text = `
            Hello, AlbanyCanCode alum!
            You're invited to create a profile for the AlbanyCanCode graduate portal. The portal serves as a resource for local employers to view profiles, download resumes and visit links of ACC graduates
            Your temporary password is: 
            ${password}
            This password will expire in 48 hours.
            Please visit http://${req.headers.host}/user/reg-form to login with your temporary password and activate your account. You will then be directed to a form to create your new profile.
            Thank you! 
          `;
          html = `
            <p>Hello, AlbanyCanCode alum!</p>
            <p>You're invited to create a profile for the AlbanyCanCode graduate portal. The portal serves as a resource for local employers to view profiles, download resumes and visit links of ACC graduates.</p>
            <p>Your temporary password is:</p>
            <h3>${password}</h3>
            <p><small><em>NOTE: This password will expire in 48 hours.</em></small></p>
            <p>Please visit this link: <a href="http://${
              req.headers.host
            }/user/reg-form">http://${
              req.headers.host
            }/user/reg-form</a> to login with your temporary password and activate your account. You will then be directed to a form to create your new profile.</p>
            <p>Thank you!</p>
          `;
        } else {
          subject = "Login to your AlbanyCanCode account";
          text = `
            Hello, AlbanyCanCode Admin
            Please activate your admin account for the AlbanyCanCode graduate portal.
            Your temporary password is: 
            ${password}
            This password will expire in 48 hours.
            Please visit http://${req.headers.host}/user/reg-form to login with your temporary password and activate your account.
            Thank you! 
          `;
          html = `
            <p>Hello, AlbanyCanCode admin!</p>
            <p>Please activate your admin account for the AlbanyCanCode graduate portal.</p>
            <p>Your temporary password is:</p>
            <h3>${password}</h3>
            <p><small><em>NOTE: This password will expire in 48 hours.</em></small></p>
            <p>Please visit this link: <a href="http://${
              req.headers.host
            }/user/reg-form">http://${
              req.headers.host
            }/user/reg-form</a> to login with your temporary password and activate your account.</p>
            <p>Thank you!</p>
          `;
        }
        const mailInfo = await sendEmail(email, subject, text, html);
        console.log("Message sent: %s", mailInfo.messageId);
      } catch (err) {
        failedToSend.push(email);
      }
    }

    if (failedToSend[0]) {
      const err = new Error(`Oops! There was a problem sending out emails to the following addresses: ${validEmailsStr}. If no emails are sent, this could be a configuration problem.`);
      err.statusCode = 501;
      throw err;
    }

    let invalidEmailsStrMssg = invalidEmailsStr 
      ? `The following emails have either an invalid format or a domain that doesn't exist: ${invalidEmailsStr}. ` 
      : "";
    let dupeEmailsStrMssg = dupeEmailsStr 
      ? `We skipped over these people because they already have a user account: ${dupeEmailsStr}. If they do not have a graduate profile already, instruct them to go to http://grads.albanycancode.org and create one.` 
      : "";

    res.setHeader("Content-Type", "application/json");
    res.status(200).send({
      success: 1,
      retMessage: (dupeEmailsStr || invalidEmailsStr)
        ? `Pst! We sent out an email to everyone with some exceptions. ${invalidEmailsStrMssg}${dupeEmailsStrMssg}`
        : "Success"
    });
  } catch (err) {
    switch (err.statusCode) {
      case 403:
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
