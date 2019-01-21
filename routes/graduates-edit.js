const express = require("express");
const router = express.Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const mysql = require("mysql2/promise");
const { auth, authErrorHandler } = require("../middleware/auth");
const serverError = require("../errors/serverError");
const config = require("../config");

router.use(auth);
router.use(authErrorHandler);

const connect = async function() {
  return await mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    port: "3306",
    password: config.dbPassword,
    database: config.dbName
  });
};

const updateGraduate = async function(connection, data) {
  const sql =
    "UPDATE graduates SET first_name = ?, last_name = ?, is_active = ?, phone = ?, story = ?, year_of_graduate = ?, email = ?, github = ?, linkedin = ?, website = ?, image = ?, resume = ?  WHERE graduate_id = ? ";
  return await connection.execute(sql, data);
};

const deleteSkills = async function(connection, graduateId) {
  const sql = "DELETE FROM skills WHERE graduate_id = ?";
  return await connection.execute(sql, [graduateId]);
};

const insertSkills = async function(connection, graduateId, skills) {
  if (!graduateId || !skills || !Array.isArray(skills))
    throw new Error("Arguments are falsy");
  if (skills.length === 0) return;

  const sql = "INSERT INTO skills(graduate_id, name) VALUES(?, ?)";
  return new Promise((resolve, reject) => {
    (async function loop(idx = 0) {
      if (idx === skills.length) return resolve();
      await connection.execute(sql, [graduateId, skills[idx]]).catch(reject);
      return loop(idx + 1);
    })();
  });
};

router.put("/", async (req, res, next) => {
  const handleServerError = serverError.bind(null, req, res, next);

  const connection = await connect().catch(handleServerError);

  const graduateData = [
    req.body.firstName || null,
    req.body.lastName || null,
    req.body.isActive || null,
    req.body.phone || null,
    req.body.story || null,
    req.body.yearOfGrad || null,
    req.body.email || null,
    req.body.github || null,
    req.body.linkedin || null,
    req.body.website || null,
    req.body.image || null,
    req.body.resume || null,
    req.body.graduateId || null
  ];
  await updateGraduate(connection, graduateData).catch(handleServerError);
  await connection.query("START TRANSACTION").catch(handleServerError);

  try {
    await deleteSkills(connection, req.body.graduateId);
    await insertSkills(connection, req.body.graduateId, req.body.skills);
    await connection.query("COMMIT");
    return res.status(200).send({
      isSuccess: 1,
      message: "Success"
    });
  } catch (err) {
    await connection.query("ROLLBACK");
    handleServerError(err);
  }
});

router.all("/", methodNotAllowed);

module.exports = router;
