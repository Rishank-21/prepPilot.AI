const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    if (error.name === "MongoServerError") {
      console.error("Authentication failed - check credentials");
    } else if (error.name === "MongoNetworkTimeoutError") {
      console.error("Network timeout - check internet connection and MongoDB Atlas whitelist");
    }
    process.exit(1);
  }
};

module.exports = connectDB;
