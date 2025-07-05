const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  address: String,
  trackingNumber: String,
  courierService: String,
  status: {
    type: String,
    enum: ["pending", "in_transit", "delivered"],
    default: "pending",
  },
  estimatedDeliveryDate: Date,
});

module.exports = mongoose.model("Shipping", shippingSchema);
