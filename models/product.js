const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  quanlityH: {
    type: String,
    require: true,
  },
  desc: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    require: true,
  },
});
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

exports.Product = mongoose.model("Product", productSchema);
