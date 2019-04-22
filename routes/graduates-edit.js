const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const methodNotAllowed = require("../errors/methodNotAllowed");
const serverError = require("../errors/serverError");
const { auth, authErrorHandler } = require("../middleware/auth");
const config = require("../config");

const Graduate = require("../models/graduate");


router.use(auth);
router.use(authErrorHandler);

router.put("/", async (req, res, next) => {
  const handleServerError = serverError.bind(null, req, res, next);

  await mongoose.connect(config.mongoUri, { useNewUrlParser: true });
 
  // TODO: Refactor to async/await
  Graduate.findById(req.body.graduateId)
    .then(grad => {
      // TODO: Add userId to request in app.js to allow additional backend auth
      // if (grad.userId.toString() !== req.body.userId.toString()) {
      //   const error = new Error('Not authorized');
      //   error.statusCode = 403;
      //   throw error;
      // }
      grad.firstName = req.body.firstName || null;
      grad.lastName = req.body.lastName || null;
      grad.isActive = req.body.isActive || null;
      grad.phone = req.body.phone || null;
      grad.story = req.body.story || null;
      grad.yearOfGrad = req.body.yearOfGrad || null;
      grad.image = req.body.image || null;
      grad.resume = req.body.resume || null;
      grad.email = req.body.email || null;
      grad.links.github = req.body.github || null;
      grad.links.linkedin = req.body.linkedin || null;
      grad.links.website = req.body.website || null;

      return grad.save();
    })
    .then(result => {
      res.status(200).send({
        isSuccess: 1,
        message: "Success"
      });
    })
    .catch(handleServerError);
});

router.all("/", methodNotAllowed);

module.exports = router;


// const connect = async function() {
//   return await mysql.createConnection({
//     host: config.dbHost,
//     user: config.dbUser,
//     port: "3306",
//     password: config.dbPassword,
//     database: config.dbName
//   });
// };

//   const updateGraduate = async function(connection, data) {
//     const sql =
//       "UPDATE graduates SET first_name = ?, last_name = ?, is_active = ?, phone = ?, story = ?, year_of_graduate = ?, email = ?, github = ?, linkedin = ?, website = ?, image = ?, resume = ?  WHERE graduate_id = ? ";
//     return await connection.execute(sql, data);
//   };
  
//   const deleteSkills = async function(connection, graduateId) {
//     const sql = "DELETE FROM skills WHERE graduate_id = ?";
//     return await connection.execute(sql, [graduateId]);
//   };
  
//   const insertSkills = async function(connection, graduateId, skills) {
//     if (!graduateId || !skills || !Array.isArray(skills))
//       throw new Error("Arguments are falsy");
//     if (skills.length === 0) return;
  
//     const sql = "INSERT INTO skills(graduate_id, name) VALUES(?, ?)";
//     return new Promise((resolve, reject) => {
//       (async function loop(idx = 0) {
//         if (idx === skills.length) return resolve();
//         await connection.execute(sql, [graduateId, skills[idx]]).catch(reject);
//         return loop(idx + 1);
//       })();
//     });
//   };

//   await updateGraduate(connection, graduateData).catch(handleServerError);
//   await connection.query("START TRANSACTION").catch(handleServerError);

//   try {
//     await deleteSkills(connection, req.body.graduateId);
//     await insertSkills(connection, req.body.graduateId, req.body.skills);
//     await connection.query("COMMIT");
//     return res.status(200).send({
//       isSuccess: 1,
//       message: "Success"
//     });
//   } catch (err) {
//     await connection.query("ROLLBACK");
//     handleServerError(err);
//   }
// });

// router.put("/", async (req, res, next) => {
//   const handleServerError = serverError.bind(null, req, res, next);

//   const connection = await connect().catch(handleServerError);

//   const graduateData = [
//     req.body.firstName || null,
//     req.body.lastName || null,
//     req.body.isActive || null,
//     req.body.phone || null,
//     req.body.story || null,
//     req.body.yearOfGrad || null,
//     req.body.email || null,
//     req.body.github || null,
//     req.body.linkedin || null,
//     req.body.website || null,
//     req.body.image || null,
//     req.body.resume || null,
//     req.body.graduateId || null
//   ];
//   await updateGraduate(connection, graduateData).catch(handleServerError);
//   await connection.query("START TRANSACTION").catch(handleServerError);

//   try {
//     await deleteSkills(connection, req.body.graduateId);
//     await insertSkills(connection, req.body.graduateId, req.body.skills);
//     await connection.query("COMMIT");
//     return res.status(200).send({
//       isSuccess: 1,
//       message: "Success"
//     });
//   } catch (err) {
//     await connection.query("ROLLBACK");
//     handleServerError(err);
//   }
// });