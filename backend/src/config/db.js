const mongoose = require("mongoose");

const connectDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    console.warn("MONGO_URI not found. Running backend in in-memory mode.");
    return false;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log("MongoDB connected.");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.warn("Falling back to in-memory mode.");
    return false;
  }
};

module.exports = connectDB;
