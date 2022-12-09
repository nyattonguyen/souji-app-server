require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  passwordHash: {
    type: String,
    require: true,
  },
  street: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    require: false,
  },
  status: {
    type: String,
    default: "enable",
  },
  resetPasswordLink: {
    data: String,
    default: "",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY_TOKEN, {
    expiresIn: process.env.EXPIRES_IN_SECONDS,
  });
};
//
userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = await crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

exports.User = mongoose.model("User", userSchema);
