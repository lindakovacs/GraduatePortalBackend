const methodNotAllowed = (req, res) => {
  return res.status(405).send({
    isSuccess: 0,
    message: "Method Not Allowed. Please try a different HTTP verb."
  });
};

module.exports = methodNotAllowed;
