const { Category } = require("../models/category");
const express = require("express");
const catchasyncerror = require("../middleware/catchasyncerror");

const router = express.Router();

router.get(
  `/`,
  catchasyncerror(async (req, res) => {
    const sort = { status: -1 };
    const categoryList = await Category.find().sort(sort);
    if (!categoryList) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
  })
);

router.get(
  "/:id",
  catchasyncerror(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res
        .status(500)
        .json({ message: "the category with the given ID was not found!" });
    }
    res.status(200).send(category);
  })
);

router.post(
  "/",
  catchasyncerror(async (req, res) => {
    try {
      let category = new Category({
        name: req.body.name,
        // countInStock:req.body.countInStock
      });
      category = await category.save();

      if (!category)
        return res.status(400).send("the category cannot be created!");

      res.send(category);
    } catch (error) {
      console.log(error);
    }
  })
);

router.put(
  "/:id",
  catchasyncerror(async (req, res) => {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
      }
    );
    if (!category)
      return res.status(400).send(" The category cannot be update !");

    res.send(category);
  })
);

router.delete(
  "/:id",
  catchasyncerror((req, res) => {
    Category.findByIdAndRemove(req.params.id)
      .then((category) => {
        if (category) {
          return res
            .status(200)
            .json({ success: true, message: "the category is deleted!" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "category note found!" });
        }
      })
      .catch((err) => {
        return res.status(400).json({ success: false, error: err });
      });
  })
);
router.put(
  `/disable/:id`,
  catchasyncerror(async (req, res, next) => {
    const discategory = await Category.findByIdAndUpdate(req.params.id);

    if (!discategory) {
      return next(new ErrorHandler("Not found", 404));
    }
    discategory.status === "enable"
      ? (discategory.status = "disable")
      : discategory;
    await discategory.save();
    res.status(200).json({
      discategory,
      success: true,
    });
  })
);

router.put(
  `/enable/:id`,
  catchasyncerror(async (req, res, next) => {
    const discategory = await Category.findByIdAndUpdate(req.params.id);

    if (!discategory) {
      return next(new ErrorHandler("Not found", 404));
    }
    discategory.status === "disable"
      ? (discategory.status = "enable")
      : discategory;
    await discategory.save();
    res.status(200).json({
      discategory,
      success: true,
    });
  })
);

module.exports = router;
