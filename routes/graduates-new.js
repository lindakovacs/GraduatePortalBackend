const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const expressJwt = require("express-jwt");
const config = require("../config");

router.use(expressJwt({ secret: config.jwtSecret }));

const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  port: "3306",
  password: config.dbPassword,
  database: config.dbName
});

router.post("/", (req, res) => {
  const sql = `INSERT INTO graduates (first_name, last_name, is_active, phone, story, year_of_graduate, email, github,linkedin, website,image,resume)
              VALUES( ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)`;
  connection.query(
    sql,
    [
      req.body.firstName,
      req.body.lastName,
      req.body.isActive,
      req.body.phone,
      req.body.story,
      req.body.yearOfGrad,
      req.body.email,
      req.body.github,
      req.body.linkedin,
      req.body.website,
      req.body.image,
      req.body.resume
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send({
          isSuccess: 0,
          retMessage: "An unexpected error occurred",
          err
        });
        // some error occured
      } else {
        let count = 0;
        let graduate_id = null;
        const skills = Object.values(req.body.skills);
        const sql = `select graduate_id from graduates where email = ${
          req.body.email
        }`;
        let skill = null;
        while (skills.length !== 0) {
          skill = skills.shift();
          if (count === 0) {
            graduate_id = result.insertId;
          }
          count++;
          const sql = "insert INTO skills (graduate_id,name) VALUES (?,?)";
          connection.query(sql, [graduate_id, skill]);
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          success: 1,
          retMessage: "Success"
        });
      }
    }
  );
});

module.exports = router;
