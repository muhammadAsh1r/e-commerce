const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// GET: Fetch cart for a user
router.get("/:userId", cartController.getCart);

// POST: Add item to cart
router.post("/add", cartController.addItem);

// DELETE: Remove one item from cart
router.delete("/:userId/item/:productId", cartController.removeItem);

// DELETE: Clear all items from cart
router.delete("/:userId", cartController.clearCart);

module.exports = router;
