const dbError = (req, res, next, err) => {
  res.status(500).send({
    isSuccess: 0,
    message: "There was a problem connecting to the database."
  });
  if (err) return next(err);
};

module.exports = dbError;