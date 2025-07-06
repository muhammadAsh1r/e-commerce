const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, brand, price, stock, images } =
      req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price, and category are required fields.",
      });
    }

    if (price < 0 || (stock && stock < 0)) {
      return res
        .status(400)
        .json({ message: "Price and stock must be non-negative." });
    }

    const product = await new Product({
      name,
      description,
      category,
      brand,
      price,
      stock,
      images,
    });

    await product.save();

    res
      .status(200)
      .json({ message: "Product added successfully", product: product });
  } catch (error) {
    console.log("Failed to add product");
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res
        .status(200)
        .json({ message: "No products found", products: [] });
    }

    res.status(200).json({ products: products });
  } catch (error) {
    console.log("Failed to get products");
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ product: product });
  } catch (error) {
    console.log("Failed to get product");
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
exports.updateProduct = async (req, res) => {
  /* logic */
};
exports.deleteProduct = async (req, res) => {
  /* logic */
};
exports.getProductsByCategory = async (req, res) => {
  /* logic */
};
exports.searchProducts = async (req, res) => {
  /* logic */
};
