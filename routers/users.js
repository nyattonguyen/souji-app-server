require("dotenv/config");
const { User } = require("../models/user");

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { bioEmail } = require("../middleware/restpw");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchasyncerror");
const { sendEmail } = require("../utils/sendEmailChangeOrForgotPassword");

router.get(`/`, async (req, res) => {
  const sort = { status: -1 };
  const userList = await User.find().select("-passwordHash").sort(sort);

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.post(`/`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    street: req.body.street,
    country: req.body.country,
    city: req.body.city,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    // countInStock:req.body.countInStock
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.post(
  "/login",
  catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).where({
      status: "enable",
    });

    if (!user) {
      return res.status(400).send("The user not found!");
    }

    const isMatchPassworded = await bcrypt.compareSync(
      req.body.password,
      user.passwordHash
    );

    if (!isMatchPassworded)
      return next(new ErrorHandler("Password or username wrong!!", 404));
    sendToken(user, 200, res);
  })
);

router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    street: req.body.street,
    country: req.body.country,
    city: req.body.city,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    status: req.body.status,
  });

  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.status(200).json({
    user,
    success: true,
  });
});

router.get(
  "/logout",
  catchAsyncError(async (req, res) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully!!",
    });
  })
);
// reset pw
router.put(
  `/forgotpassword`,
  catchAsyncError(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    console.log(user);

    if (!user) {
      return res.status(200).json({
        status: false,
        message: "Invalid Email",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY_TOKEN
    );

    await user.updateOne({ resetPasswordLink: token });

    const templateEmail = {
      from: "nhat250701@gmail.com",
      to: email,
      subject: "Link reset password",
      html: `<p>Changepassword </p><p>${process.env.CLIENT_URL}/resetpassword/${token}</p>`,
    };

    bioEmail(templateEmail);

    return res.status(200).json({
      status: true,
      message: "Link reset password from E-SOUJI",
    });
  })
);

router.put(
  `/forgot`,
  catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    console.log(user);

    // @ts-ignore
    const tokenReset = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `http://localhost:3000/reset-password/${tokenReset}`;

    const message = `Your password reset token is <a href="${resetPasswordUrl}">Click</a> you have a link`;

    try {
      await sendEmail({
        email: user.email,
        suject: "E-Souji",
        message: `<b>Changepassword Link:${message} </b>`,
        html: `<b>Changepassword Link: ${message}</b>`,
      });

      return res.status(200).json({
        success: true,
        message,
        email: user.email,
        suject: "E-Souji",
        html: `<b>Changepassword Link: </b>${message}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler("server internal :  " + error.message, 500));
    }
  })
);

router.put(
  `/resetpassword`,
  catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = await crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordExpire: { $gt: Date.now() },
      resetPasswordToken,
    });

    if (!user) {
      return next(new ErrorHandler("User not found or not logged in", 404));
    }

    if (req.body.newPasssword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Comfirm password not matched", 400));
    }

    user.password = req.body.newPasssword;

    await user.save();

    sendToken(user, 200, res);
  })
);

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments({ count: count });

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

router.put(
  `/:id`,
  catchAsyncError(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(402).send("Invalid user");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        street: req.body.street,
        country: req.body.country,
        phone: req.body.phone,
      },
      {
        new: true,
      }
    );

    if (!user) return res.status(500).send("User cannot update");

    res.send(user);
  })
);

// router.delete("/:id", (req, res) => {
//   User.findByIdAndRemove(req.params.id)
//     .then((user) => {
//       if (user) {
//         return res
//           .status(200)
//           .json({ success: true, message: "the user is deleted!" });
//       } else {
//         return res
//           .status(404)
//           .json({ success: false, message: "user note found!" });
//       }
//     })
//     .catch((err) => {
//       return res.status(400).json({ success: false, error: err });
//     });
// });

// get user by id
router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

// disable user
router.put(
  `/disable/:id`,
  catchAsyncError(async (req, res, next) => {
    const disuser = await User.findById(req.params.id);

    if (!disuser) {
      return next(new ErrorHandler("Not found", 404));
    }
    disuser.status === "enable" ? (disuser.status = "disable") : disuser;
    await disuser.save();
    res.status(200).json({
      disuser,
      success: true,
    });
  })
);

module.exports = router;
