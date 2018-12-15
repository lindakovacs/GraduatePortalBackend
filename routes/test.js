const express = require("express");
const router = express.Router();

/* GET users listing. */
router.post("/", (req, res, next) => {
  res.send({
    isSuccess: 1,
    retMessage: "Success",
    message: "Hello World"
  });
});

module.exports = router;
