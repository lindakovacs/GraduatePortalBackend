const express = require("express");
const upload = require("../services/upload");
const router = express.Router();

const s3Folder = "profile-images";

router.put("/", (req, res) => {
  try {
    const fileObj = req.files.image;
    if (!fileObj) {
      return res.status(400).send({
        isSuccess: 0,
        message: "Invalid request",
        token: ""
      });
    }

    upload(s3Folder, fileObj)
      .then(data =>
        res.send({
          isSuccess: 1,
          message: "Success",
          imageUrl: data.imageUrl
        })
      )
      .catch(() => {
        res.status(500).send({
          isSuccess: 0,
          message: "Error uploading image",
          imageUrl: ""
        });
      });
  } catch (e) {
    // TODO log
    console.log(e);
    return res.status(500).send({
      isSuccess: 0,
      message: "An unexpected error occurred",
      imageUrl: ""
    });
  }
});

module.exports = router;
