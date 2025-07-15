const mongoose = require("mongoose");
const Order = require("../models/Order");

const Cart = require("../models/Cart"); // import Cart model

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !totalAmount ||
      !shippingAddress
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
    });

    await newOrder.save();

    // Clear cart after successful order creation
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { paymentStatus, orderStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentStatus, orderStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const orders = await Order.find({ userId })
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

