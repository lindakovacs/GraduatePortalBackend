const express = require("express");
const router = express.Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const config = require("../config");

const invalidResponse = (req, res, next) => {
  res.status(200).send({
    isSuccess: 0,
    message: "Invalid username or password",
    token: ""
  });
};

const serverError = (req, res, next, err) => {
  res.status(500).send({
    isSuccess: 0,
    message: "An unexpected error occurred",
    token: ""
  });
  next(err);
};

router.post("/", (req, res, next) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.status(400).send({
      isSuccess: 0,
      message: "Invalid request",
      token: ""
    });
    throw new Error("Invalid request");
  }

  const connection = mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
  });

  connection.connect(err => {
    // TODO figure out how to handle error without whole app crashing
    if (err) throw err;
  });

  const sql = "SELECT user_id, password FROM users WHERE username = ? LIMIT 1";
  connection.query(
    { sql, values: [username], timeout: 30000 },
    (err, results) => {
      if (err) return serverError(req, res, next, err);

      const [user] = results;
      // Invalid username
      if (!user) return invalidResponse(req, res, next);

      bcrypt.compare(
        password,
        user.password.toString(),
        (err, passwordsMatch) => {
          if (err) return serverError(req, res, next, err);

          if (passwordsMatch) {
            // Valid credentials
            // TODO wishlist - tokens should expire
            const token = jwt.sign({ sub: user.user_id }, config.jwtSecret);
            return res.status(200).send({
              isSuccess: 1,
              message: "Success",
              token
            });
            // Invalid password
          } else return invalidResponse(req, res, next);
        }
      );
    }
  );
});

router.all("/", methodNotAllowed);

module.exports = router;
