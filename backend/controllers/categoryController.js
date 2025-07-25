const mongoose = require("mongoose");
const Category = require("../models/Category");

// Search category by name (case-insensitive partial match) and return id(s)
exports.searchCategoryByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Name query parameter is required." });
    }

    // Find categories where name contains the search string (case-insensitive)
    const categories = await Category.find({
      name: { $regex: name, $options: "i" },
    }).select("_id name"); // return only _id and name fields

    if (categories.length === 0) {
      return res
        .status(404)
        .json({ message: "No categories found matching the name." });
    }

    // Return found categories with id and name
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const category = new Category({ name, description });
    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
