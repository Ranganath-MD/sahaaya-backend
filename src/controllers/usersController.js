const express = require("express");
const router = express.Router();
const { User } = require("../models/userModel");
const { comparePassword, generateToken } = require("../utils/utilities");
const { authenticateUser } = require("../middleware/authorizeUser");

router.post("/register", (req, res) => {
  const body = req.body;
  User.findOne({ email: body.email })
    .then((result) => {
      if (result)
        res
          .status(409)
          .send({ status: 409, message: "The user already exists" });
      else {
        const user = new User(body);
        user
          .save()
          .then(() => {
            res.status(200).send({
              status: 200,
              message: "Successfully registered to the portal",
              email: user.email,
            });
          })
          .catch((err) => {
            res.send(err);
          });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/login", (req, res) => {
  const body = req.body;
  User.findOne({ email: body.email }).then(async (user) => {
    if (!user) {
      res
        .status(401)
        .send({ status: 401, message: "Can't find this user in our System" });
    } else {
      comparePassword(body.password, user.password)
        .then(async (isValidPassword) => {
          if (!isValidPassword) {
            res
              .status(401)
              .send({ status: 401, message: "Invalid email/ Password" });
          } else {
            const token = await generateToken(user);
            user.tokens.push({
              token,
            });
            user
              .save()
              .then((user) => {
                res.status(200).send({
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  token: user.tokens[0].token,
                  type: user.type,
                });
              })
              .catch(() => {
                res
                  .status(401)
                  .send({ status: 401, message: "token required" });
              });
          }
        })
        .catch(() => {
          res
            .status(401)
            .send({ status: 401, message: "Invalid email/ Password" });
        });
    }
  });
});

router.delete("/logout", authenticateUser, (req, res) => {
  // const { user, token } = req
  const token = req.token;
  const user = req.user;
  User.findByIdAndUpdate(user._id, { $pull: { tokens: { token: token } } })
    .then(() => {
      res.status(200).send({
        message: "successfully logged out",
        status: 200,
      });
    })
    .catch(() => {
      res.status(401).send({ status: 401, message: "Unauthorized" });
    });
});

router.get("/profile", authenticateUser, (req, res) => {
  const { user } = req;
  res.send(user);
});

module.exports = {
  usersRouter: router,
};
