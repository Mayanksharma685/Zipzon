import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.log("[DB] No MONGODB_URI - using mock mode");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.error("Connection error:", error.message);
  }
};

export default connectDB;
