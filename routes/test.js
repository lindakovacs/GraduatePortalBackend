const express = require("express");
const router = express.Router();

/* GET users listing. */
router.post("/", (req, res, next) => {
  res.send({
    isSuccess: 1,
    retMessage: "Success",
    message: "Hellos World"
  });
});

module.exports = router;
