const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Create a new category
router.post("/", categoryController.createCategory);

// Get all categories
router.get("/", categoryController.getAllCategories);

// Search categories by name query parameter
router.get("/search", categoryController.searchCategoryByName);

// Get category by ID
router.get("/:id", categoryController.getCategoryById);

// Update category by ID
router.put("/:id", categoryController.updateCategory);

// Delete category by ID
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
