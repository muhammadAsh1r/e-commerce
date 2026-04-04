const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected!");
  } catch (error) {
    if (error) {
      console.log("MongoDB Connection Failed: ", error);
    }
  }
};

module.exports = connectDB;
