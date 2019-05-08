const nodemailer = require("nodemailer");

const config = require("../config");

const sendEmail = (to, subject, html) => {

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.gmailUser,
      pass: config.gmailPassword
    }
  });

  const mailOptions = {
    from: config.gmailUser, // sender address
    to, // list of receivers (string or comma-delimited strings)
    subject, // subject line (string)
    html// html body
  };

  return transporter.sendMail(mailOptions);

};

module.exports = sendEmail;