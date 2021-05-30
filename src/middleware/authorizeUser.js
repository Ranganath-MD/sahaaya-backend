
const { User } = require("../models/userModel");
const { validateToken } = require("../utils/utilities");

exports.authenticateUser = function ( req, res, next ) {
  const token = req.header("Authorization");
  const tokenData = validateToken(token);
  if(tokenData === "error") {
    res.status(403).send({message : "Please login to access"})
  }
  User.findOne({
    _id: tokenData._id,
    "tokens.token": token,
  }).select("-password -tokens").populate("campaigns")
    .then((user) => {
        if(user){
            req.user = user
            req.token = token;
            next()
        }else{
            res.status(403).send({message : "Please login to access"})
        }
    })
    .catch(() => {
      res.status(403).send({message : "Please login to access"})
    });
};
