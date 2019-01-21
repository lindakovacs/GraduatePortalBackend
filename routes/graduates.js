const express = require("express");
const router = express.Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const mysql = require("mysql2");
const serverError = require("../errors/serverError");
const config = require("../config");

const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  port: "3306",
  password: config.dbPassword,
  database: config.dbName
});

router.get("/", (req, res, next) => {
  connection.query(
    "SELECT * FROM graduates g LEFT JOIN (SELECT graduate_id, GROUP_CONCAT(name) AS skills FROM skills GROUP BY graduate_id) s ON g.graduate_id = s.graduate_id ORDER BY year_of_graduate, last_name, first_name;",
    (err, result) => {
      if (err) return serverError(req, res, next, err);
      const profiles = result.reduce((acc, row) => {
        acc[row.graduate_id] = {
          id: row.graduate_id,
          firstName: row.first_name || "",
          lastName: row.last_name || "",
          isActive: row.is_active,
          phone: row.phone || "",
          story: row.story || "",
          yearOfGrad: row.year_of_graduate || "",
          resume: row.resume || "",
          links: {
            email: row.email || "",
            github: row.github || "",
            linkedin: row.linkedin || "",
            website: row.website || ""
          },
          image: row.image || "",
          skills: row.skills ? row.skills.split(",") : []
        };
        return acc;
      }, {});
      res.status(200).send({
        isSuccess: 1,
        message: "Success",
        profiles
      });
    }
  );
});

router.all("/", methodNotAllowed);

module.exports = router;
