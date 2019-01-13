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

getUserSkills = graduateId => {
  const sql = "Select name FROM skills WHERE graduate_id = ?";

  return new Promise((resolve, reject) => {
    connection.query(sql, [graduateId], (err, result) => {
      if (err) {
        console.log(err);
      }
      const skills = result.reduce((acc, skill, index) => {
        acc.push(skill.name);
        return acc;
      }, []);
      resolve(skills);
      if (err) {
        reject(err);
      }
    });
  });
};

updateUserSkills = (skills, graduateId, orginalSkills, res) => {
  let count = 0;
  console.log(skills);
  const sql = `UPDATE skills SET name = ? WHERE graduate_id = ?  AND name = ?`;

  while (skills.length !== 0) {
    skill = skills.shift();
    orginalSkill = orginalSkills.shift();
    console.log(skill);
    connection.query(sql, [orginalSkill, graduateId, skill], (err, result) => {
      if (err) {
        return res.status(500).send({
          isSuccess: 0,
          message: "An unexpected error occurred"
        });
      } else {
        console.log("success");
      }
    });
  }
  return res.status(200).send({
    isSuccess: 1,
    message: "Success"
  });
};

router.put("/", (req, res) => {
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
      req.body.yearOfGrad,
      req.body.email,
      req.body.github,
      req.body.linkedin,
      req.body.website,
      req.body.image,
      req.body.resume,
      req.body.graduateId,
      req.body.updateUserSkills
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send({
          isSuccess: 0,
          message: "An unexpected error occurred"
        });
      } else {
        const skills = getUserSkills(req.body.graduateId);
        console.log(req.body.skills);
        skills.then(skill => {
          updateUserSkills(skill, req.body.graduateId, req.body.skills, res);
        });
      }
    }
  );
});

router.all("/", methodNotAllowed);

module.exports = router;
