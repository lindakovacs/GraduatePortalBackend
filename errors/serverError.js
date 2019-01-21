const serverError = (req, res, next, err) => {
  res.status(500).send({
    isSuccess: 0,
    message: "An unexpected error occurred"
  });
  if (err) return next(err);
};

module.exports = serverError;
