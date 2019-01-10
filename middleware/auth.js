const expressJwt = require("express-jwt");
const config = require("../config");

const auth = expressJwt({ secret: config.jwtSecret });

const authErrorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({
      isSuccess: 0,
      message: "Unauthorized. Please include a valid authorization token."
    });
  }
  next();
};

module.exports = { auth, authErrorHandler };
