const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String],
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
