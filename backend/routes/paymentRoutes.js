const express = require("express");
const router = express.Router();
const { createPaymentIntent } = require("../controllers/paymentController");

// Use standard auth middleware if you enforce logged in checkout
// But since the current checkout creates guest orders too, we will keep it simple.
// Using standard controller function
router.post("/create-intent", createPaymentIntent);

module.exports = router;
