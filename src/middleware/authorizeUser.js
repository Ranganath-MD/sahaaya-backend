
const { User } = require("../models/userModel");
const { validateToken } = require("../utils/utilities");

exports.authenticateUser = function ( req, res, next ) {
  const token = req.header("Authorization");
  const tokenData = validateToken(token);
  User.findOne({
    _id: tokenData._id,
    "tokens.token": token,
  })
    .then((user) => {
        if(user){
            req.user = user
            req.token = token;
            next()
        }else{
            res.status(401).send({message : "Please login to access"})
        }
    })
    .catch(() => {
      console.log("token invalid");
    });
};
