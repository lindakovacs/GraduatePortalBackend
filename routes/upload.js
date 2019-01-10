const express = require("express");
const upload = require("../services/upload");
const router = express.Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const { auth, authErrorHandler } = require("../middleware/auth");

router.use(auth);
router.use(authErrorHandler);

const handleUpload = (s3Folder, req, res) => {
  try {
    const fileObj = req.files.image;
    if (!fileObj) {
      return res.status(400).send({
        isSuccess: 0,
        message: "Invalid request",
        url: ""
      });
    }

    upload(s3Folder, fileObj)
      .then(data =>
        res.send({
          isSuccess: 1,
          message: "Success",
          url: data.url
        })
      )
      .catch(err => {
        res.status(500).send({
          isSuccess: 0,
          message: `Error uploading to ${s3Folder}`,
          url: ""
        });
        throw err;
      });
  } catch (err) {
    res.status(500).send({
      isSuccess: 0,
      message: "An unexpected error occurred",
      url: ""
    });
    throw err;
  }
};

router.put("/image", handleUpload.bind(null, "profile-images"));
router.all("/image", methodNotAllowed);

router.put("/resume", handleUpload.bind(null, "resumes"));
router.all("/resume", methodNotAllowed);

module.exports = router;
