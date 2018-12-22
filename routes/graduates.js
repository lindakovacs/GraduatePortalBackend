const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const config = require("../config");
const compileTableData = data => {
  console.log("test");
  const results = data.reduce((acc, graduate) => {
    if (!acc[graduate.graduate_id]) {
      acc[graduate.graduate_id] = {
        id: graduate.graduate_id,
        firstName: graduate.first_name,
        lastName: graduate.last_name,
        image: graduate.image,
        skills: [],
        email: graduate.email,
        isActive: graduate.is_active,
        phone: graduate.phone,
        links: {
          github: graduate.github,
          linkedin: graduate.linkedin,
          website: ""
        },
        yearOfGraduate: graduate.year_of_graduate,
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
  password: config.dbPassword,
  database: config.dbName
});

connection.connect((result, err) => {
  console.log(result);
  console.log(err);
});

console.log(connection.state);
router.get("/", (req, res) => {
  connection.query(
    "select  * from graduates INNER JOIN skills on graduates.graduate_id = skills.graduate_id;",
    (err, result, fields) => {
      console.log(result);
      // results = compileTableData(result);
      // res.setHeader("Content-Type", "application/json");
      // res.status(200).send({
      //   success: 1,
      //   retMessage: "Success",
      //   profiles: results
      // });
    }
  );
});

module.exports = router;
