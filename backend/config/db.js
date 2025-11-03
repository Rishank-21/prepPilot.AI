const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
      dbName: "preppilot",
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Add detailed error logging
    if (error.name === "MongoServerError") {
      console.error("Authentication failed - check credentials");
    }
    process.exit(1);
  }
};

module.exports = connectDB;
