const bcrypt = require("bcryptjs");

const User = require("../models/User");

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    if (updates.password) {
      return res
        .status(400)
        .json({ message: "Password update not allowed here" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, address, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      phone,
    });

    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);

    if (user) {
      res.status(200).json({ user: user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
