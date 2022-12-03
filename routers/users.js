const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchasyncerror");
const e = require("express");

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
