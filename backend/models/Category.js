const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // self-reference
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
