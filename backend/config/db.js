const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "preppilot",
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Log more details about the error
    if (error.name === "MongoServerError" && error.code === 18) {
      console.error("Authentication failed - please check your credentials");
    }
    process.exit(1);
  }
};

module.exports = connectDB;
