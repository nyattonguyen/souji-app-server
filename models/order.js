const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  address: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
    default: "4",
  },
  totalPrice: {
    type: Number,
  },
  note: {
    type: String,
    default: "",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: String,
    require: true,
  },
  hours: {
    type: String,
    require: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

exports.Order = mongoose.model("Order", orderSchema);

/**
Order Example:

{
    "orderItems" : [
        {
            "date": "23",
            "hours":"3",
            "product" : "6337212813a6db01c72bf02d"
        }
        
    ],
    "address" : "Flowers Street , 45",
    "name" : "1-B",
    "phone": "0123456789",
    "status": "00000",
    "totalPrice": "123",
    "user": "633ceb4ae203a6557744d136"
}

 */
