const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 128,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  const user = this;
  // Checking whether the email is new or not
  if (user.isNew) {
    //encoding the password
    await bcryptjs
      .genSalt(10)
      .then(async function (salt) {
        await bcryptjs
          .hash(user.password, salt)
          .then(function (encryptPassword) {
            user.password = encryptPassword;
            next();
          });
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = {
    User
}
