exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Users found',
  });
};

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Users found',
  });
};
