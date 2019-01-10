const express = require("express");
const router = express.Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const mysql = require("mysql");
const { auth, authErrorHandler } = require("../middleware/auth");
const config = require("../config");

router.use(auth);
router.use(authErrorHandler);

const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  port: "3306",
  password: config.dbPassword,
  database: config.dbName
});
const sql = `INSERT INTO graduates (first_name, last_name, is_active, phone, story, year_of_graduate, email, github,linkedin, website,image,resume)
              VALUES( ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)`;
router.put("/", (req, res) => {
  //UPDATE `graduates_dev`.`graduates` SET `is_active` = '0', `phone` = '555-555-5550' WHERE (`graduate
  const sql =
    "UPDATE graduates  SET first_name = ?, last_name = ?, is_active = ?, phone = ?, story = ?, year_of_graduate = ?, email = ?, github = ?, linkedin = ?, website = ?, image = ?, resume = ?  WHERE graduate_id = ? ";
  connection.query(
    sql,
    [
      req.body.firstName,
      req.body.lastName,
      req.body.isActive,
      req.body.phone,
      req.body.story,
      req.body.yearOfGraduate,
      req.body.email,
      req.body.github,
      req.body.linkedin,
      req.body.website,
      req.body.image,
      req.body.resume,
      req.body.graduateId
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send({
          isSuccess: 0,
          message: "An unexpected error occurred",
          err
        });
      } else {
        return res.status(200).send({
          isSuccess: 1,
          message: "Success"
        });
      }
    }
  );
});

router.all("/", methodNotAllowed);

module.exports = router;
