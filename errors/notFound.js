const notFound = (req, res) => {
  return res.status(405).send({
    isSuccess: 0,
    message: "Page Not Found. Please check your URL"
  });
};

module.exports = notFound;
