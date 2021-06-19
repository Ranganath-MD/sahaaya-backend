const { User } = require("../models/userModel");
const { validateToken } = require("../utils/utilities");

exports.checkAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const tokenData = validateToken(token);
    if(tokenData === "error") {
      res.status(403).send({message : "Please login to access"})
    }
    const user = await User.findOne({
      _id: tokenData._id,
      "tokens.token": token,
    })
    if(user.type === "Admin") {
      req.user = user;
      req.token = token;
      next();
    }else {
      res.send({ message: "Only Admin can access this resource" })
    }
  }catch (err) {
    console.log(err)
  }
}