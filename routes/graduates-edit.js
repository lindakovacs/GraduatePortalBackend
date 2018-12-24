const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const config = require("../config");

const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  port: "3306",
  password: config.dbPassword,
  database: config.dbName
});

router.put("/", (req, res) => {});

module.exports = router;
