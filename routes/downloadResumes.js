const express = require("express");
const router = express.Router();
const createZip = require("../services/createZip");
const expressJwt = require("express-jwt");
const config = require("../config");

router.use(expressJwt({ secret: config.jwtSecret }));

router.get("/", (req, res, next) => {
  // TODO do not hardcode
  const urls = [
    "https://s3.us-east-2.amazonaws.com/albanycancode-graduates-uploads/resumes/q407businessoutlook.pdf",
    "https://s3.us-east-2.amazonaws.com/albanycancode-graduates-uploads/resumes/placeholder+PDF.pdf"
  ];
  return createZip(urls)
    .then(file => res.download(file))
    .catch(err => {
      res.status(500).send({
        isSuccess: 0,
        message: "An unexpected error occurred"
      });
      next(err);
    });
});

module.exports = router;
