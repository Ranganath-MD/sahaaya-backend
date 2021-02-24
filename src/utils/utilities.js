const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.comparePassword = async ( body_password, user_password ) => {
  try {
    const match = await bcrypt.compare(body_password, user_password);
    if (!match) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

exports.generateToken = async (user) => {
  const tokenData = {
    _id: user._id,
    username: user.username,
    createdAt: Number(new Date()),
  };
  const token = jwt.sign(tokenData, "sahaaya@2021");
  return token;
};

exports.validateToken = (req_token) => {
  const tokenData = jwt.verify(req_token, "sahaaya@2021");
  return tokenData;
};
