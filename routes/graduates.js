const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const config = require("../config");
const compileTableData = data => {
  const results = data.reduce((acc, graduate) => {
    if (!acc[graduate.graduate_id]) {
      acc[graduate.graduate_id] = {
        id: graduate.graduate_id,
        firstName: graduate.first_name,
        lastName: graduate.last_name,
        image: graduate.image,
        skills: [],
        isActive: graduate.is_active,
        phone: graduate.phone,
        links: {
          email: graduate.email,
          github: graduate.github,
          linkedin: graduate.linkedin,
          website: graduate.website
        },
        yearOfGrad: graduate.year_of_graduate,
        resume: graduate.resume,
        story: graduate.story
      };
    }
    acc[graduate.graduate_id].skills.push(graduate.name);
    return acc;
  }, {});
  return results;
};

const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  port: "3306",
  password: config.dbPassword,
  database: config.dbName
});

connection.connect(err => {
  if (err) {
    // TODO log
    console.log("Could not connect to database: ", err);
    // TODO figure out how to catch this
    throw Error("Could not connect to database");
  }
});

router.get("/", (req, res) => {
  connection.query(
    "select  * from graduates INNER JOIN skills on graduates.graduate_id = skills.graduate_id;",
    (err, result, fields) => {
      results = compileTableData(result);
      res.setHeader("Content-Type", "application/json");
      res.status(200).send({
        success: 1,
        retMessage: "Success",
        profiles: results
      });
    }
  );
});

module.exports = router;
