const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
