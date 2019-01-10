const express = require("express");
const router = express.Router();
const notFound = require("../errors/notFound");

router.all("/*", notFound);

module.exports = router;
