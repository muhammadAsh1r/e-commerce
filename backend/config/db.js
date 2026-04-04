const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected!");
  } catch (error) {
    console.error("CRITICAL: MongoDB Connection Failed. API will not function correctly.");
    console.error(error);
  }
};

module.exports = connectDB;
