const express = require("express");
const router = express.Router();
const productsRouter = require("./products");
const usersRouter = require("./users");
const ordersRouter = require("./orders");
const categoriesRouter = require("./categories");

router.use(`/orders`, ordersRouter);
router.use(`/products`, productsRouter);
router.use(`/users`, usersRouter);
router.use(`/categories`, categoriesRouter);

module.exports = router;
