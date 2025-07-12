const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get cart by userId
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart)
      return res.status(200).json({ userId, items: [], totalPrice: 0 });

    res.status(200).json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
};

// Add or update item in cart
exports.addItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const itemPrice = product.price * quantity;

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
        totalPrice: itemPrice,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ productId, quantity });
      }

      // Recalculate total
      cart.totalPrice = await calculateTotal(cart.items);
    }

    await cart.save();
    const populatedCart = await cart.populate("items.productId");
    res.status(200).json(populatedCart);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: "Error adding item", error: err.message });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    cart.totalPrice = await calculateTotal(cart.items);

    await cart.save();
    const populatedCart = await cart.populate("items.productId");
    res.status(200).json(populatedCart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing item", error: err.message });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: err.message });
  }
};

// Utility function to calculate total
async function calculateTotal(items) {
  let total = 0;

  for (let item of items) {
    const product = await Product.findById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  return total;
}
