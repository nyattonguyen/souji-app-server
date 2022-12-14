const { Product } = require("../models/product");
const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const catchasyncerror = require("../middleware/catchasyncerror");

router.get(
  `/`,
  catchasyncerror(async (req, res) => {
    const sort = { status: -1 };
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }

    const productList = await Product.find(filter)
      .populate("category")
      .sort(sort);
    if (!productList) {
      res.status(500).json({ success: false });
    }
    res.send(productList);
    // res.status(200).json({
    //   productList,
    //   success: true,
    // });
  })
);

router.get(
  `/priceasc`,
  catchasyncerror(async (req, res) => {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const sort = { price: 1 };
    const productListAsc = await Product.find(filter)
      .populate("category")
      .sort(sort);
    if (!productListAsc) {
      res.status(500).json({ success: false });
    }
    res.send(productListAsc);
  })
);

router.get(
  "/:id",
  catchasyncerror(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      res
        .status(500)
        .json({ message: "the product with the given ID was not found!" });
    }
    res.status(200).send(product);
  })
);

router.post(
  `/`,
  catchasyncerror(async (req, res) => {
    console.log(req.body.category);
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    let product = new Product({
      name: req.body.name,
      price: req.body.price,
      quanlity: req.body.quanlity,
      desc: req.body.desc,
      category: req.body.category,
    });

    product = await product.save();

    if (!product) return res.status(500).send("The product cannot be created");

    res.send(product);
  })
);

router.put(
  "/:id",
  catchasyncerror(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(500).send(" Invalid product id !");
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        quanlityH: req.body.quanlityH,
        desc: req.body.desc,
        category: req.body.category,
      },
      {
        new: true,
      }
    );
    if (!product)
      return res.status(500).send(" The product cannot be update !");

    res.send(product);
  })
);
// pin product
router.put(
  `/get/pin/:id`,
  catchasyncerror(async (req, res, next) => {
    const active = await Product.findById(req.params.id);

    if (!active) {
      return next(new ErrorHandler("Not found", 404));
    }
    active.status === false ? (active.status = true) : active;
    await active.save();
    res.status(200).json({
      active,
      success: true,
    });
  })
);
// unpin product
router.put(
  `/get/unpin/:id`,
  catchasyncerror(async (req, res, next) => {
    const unactive = await Product.findById(req.params.id);

    if (!unactive) {
      return next(new ErrorHandler("Not found", 404));
    }
    unactive.status === true ? (unactive.status = false) : unactive;
    await unactive.save();
    res.status(200).json({
      unactive,
      success: true,
    });
  })
);

//delete product
router.delete(
  "/:id",
  catchasyncerror((req, res) => {
    Product.findByIdAndRemove(req.params.id)
      .then((product) => {
        if (product) {
          return res
            .status(200)
            .json({ success: true, message: "the product is deleted!" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "product note found!" });
        }
      })
      .catch((err) => {
        return res.status(400).json({ success: false, error: err });
      });
  })
);

router.get(
  "/get/count",
  catchasyncerror(async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
      res.status(500).json({ success: false });
    }
    res.status(200).send({
      productCount: productCount,
    });
  })
);

// router.get('/get/featured/:count', async(req, res)=> {
// const count = req.params.count ? req.params.count : 0
//     const products = await Product.find({isFeatured: true}).limit(+count);

//     if(!products) {
//         res.status(500).json({success: false})
//     }
//     res.status(200).send(products);
// })

module.exports = router;
