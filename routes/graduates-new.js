const express = require("express");
const router = express.Router();

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
      req.body.yearOfGraduate,
      req.body.email,
      req.body.github,
      req.body.linkedin,
      req.body.website,
      req.body.image,
      req.body.resume
    ],
    (err, result) => {
      if (err) {
        // some error occured
        return;
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
      }
    }
  );
});

module.exports = router;
