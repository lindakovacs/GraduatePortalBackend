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

const getUserSkills = graduateId => {
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

const getUniqueSkills = (existingSkills, newSkills) => {
  const combinedSkills = newSkills.concat(existingSkills);
  const uniqueSkills = [];
  const uniqueSkillsObj = combinedSkills.reduce((acc, skill) => {
    acc[skill] = acc[skill] ? (acc[skill] += 1) : (acc[skill] = 1);
    return acc;
  }, {});

  for (let key in uniqueSkillsObj) {
    uniqueSkillsObj[key] < 2 && uniqueSkills.push(key);
  }

  return uniqueSkills;
};

const updateUserSkills = (skills, graduateId, orginalSkills, res) => {
  skills = [...skills].filter(skill => skill !== "");
  orginalSkills = [...orginalSkills].filter(skill => skill !== "");

  const sql = "UPDATE skills SET name = ? WHERE graduate_id = ?  AND name = ?";

  while (skills.length !== 0) {
    const skill = skills.shift();
    const orginalSkill = orginalSkills.shift();

    if (orginalSkill) {
      connection.query(
        sql,
        [orginalSkill, graduateId, skill],
        (err, result) => {
          if (err) {
            return res.status(500).send({
              isSuccess: 0,
              message: "An unexpected error occurred",
              err
            });
          }
        }
      );
    }
  }
  return true;
};

const insertSkills = (skills, graduate_id) => {
  while (skills.length !== 0) {
    const skill = skills.shift();
    const sql = "insert INTO skills (graduate_id,name) VALUES (?,?)";
    connection.query(sql, [graduate_id, skill], (err, result) => {
      if (err) {
        return false;
      }
    });
  }
  return true;
};

const deleteSkills = (skills, graduate_id) => {
  while (skills.length !== 0) {
    const skillToDelete = skills.shift();
    const sql = "DELETE from skills where graduate_id = ? AND name = ?";
    connection.query(sql, [graduate_id, skillToDelete], (err, result) => {
      if (err) {
        return true;
      }
    });
  }
  return true;
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

        skills.then(skill => {
          updateUserSkills(skill, req.body.graduateId, req.body.skills, res);

          if (req.body.skills.length > skill.length) {
            const skills = getUniqueSkills(req.body.skills, skill);
            if (skills) {
              const response = insertSkills(skills, req.body.graduateId);
              if (response) {
                res.status(200).send({
                  isSuccess: 1,
                  message: "Success"
                });
              }
            }
          } else if (req.body.skills.length < skill.length) {
            const skills = getUniqueSkills(req.body.skills, skill);
            const response = deleteSkills(skills, req.body.graduateId);
            if (response) {
              res.status(200).send({
                isSuccess: 1,
                message: "Success"
              });
            }
          }
        });
      }
    }
  );
});

router.all("/", methodNotAllowed);

module.exports = router;
