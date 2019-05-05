const dbError = (req, res, next, err) => {
  res.status(500).send({
    isSuccess: 0,
    message: "An internal server error occurred."
  });
  if (err) return next(err);
};

module.exports = dbError;