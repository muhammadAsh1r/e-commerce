const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  logoutUser,
  getUserProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Public Routes
router.post("/signup", signupUser); // Register user
router.post("/login", loginUser); // Login user
router.post("/logout", logoutUser); // Logout (handled on frontend)

// Protected Route
router.get("/profile", protect, getUserProfile); // Only for logged-in users

module.exports = router;
