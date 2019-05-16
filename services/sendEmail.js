const nodemailer = require("nodemailer");

const config = require("../config");

const sendEmail = (to, subject, text, html) => {

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
    text, // plaintext version of message
    html, // html version of message
    messageId: to, // custom ID for message - recipient's email address
    dsn: {
      id: `recipient:_${to}`,
      return: "headers",
      notify: ["failure", "delay"],
      recipient: config.gmailUser
    }
  };

  return transporter.sendMail(mailOptions);

};

module.exports = sendEmail;