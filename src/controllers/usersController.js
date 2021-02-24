const express = require("express");
const router = express.Router();
const { User } = require("../models/userModel")
const { comparePassword, generateToken } = require("../utils/utilities");
const { authenticateUser } = require("../middleware/authorizeUser");

router.post("/register", (req, res) => {
  const body = req.body;
  User.findOne({ email: body.email })
    .then((result) => {
      if (result) res.send({ message: "The user already exists" });
      else {
        const user = new User(body);
        user
          .save()
          .then(() => {
            res.send({ message: "Successfully registered to the portal" });
          })
          .catch((err) => {
            res.send(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res) => {
  const body = req.body;
  User.findOne({ email: body.email }).then(async (user) => {
    if (!user) {
      res.send({ message: "Invalid email/ Password" });
    }
    comparePassword(body.password, user.password)
      .then(async (isValidPassword) => {
        if (!isValidPassword) {
          res.send({ message: "Invalid email/ Password" });
        } else {
          const token = await generateToken(user);
          user.tokens.push({
            token,
          });
          user
            .save()
            .then((user) => {
              res.send({
                username: user.username,
                loginTime: user.loginTime,
                token: user.tokens[0].token,
                email: user.email,
              });
            })
            .catch(() => {
              res.send({ message: "token required" });
            });
        }
      })
      .catch(() => {
        res.send({ message: "Invalid email/ Password" });
      });
  });
});

router.delete("/logout", authenticateUser, (req, res) => {
  // const { user, token } = req
  const token = req.token;
  const user = req.user;
  User.findByIdAndUpdate(user._id, { $pull: { tokens: { token: token } } })
    .then(() => {
      res.send({ notice: "successfully logged out" });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/profile", authenticateUser, (req, res) => {
  const { user } = req;
  res.send(user);
});

module.exports = {
  usersRouter: router,
};
