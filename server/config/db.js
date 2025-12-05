import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => 
      console.log("Database Connected")
    );

    const url = process.env.MONGODB_URL;

    // If URL already contains /greencart, do NOT append again
    const finalUrl = url.includes("greencart") ? url : `${url}/greencart`;

    await mongoose.connect(finalUrl);

  } catch (error) {
    console.error("MongoDB Error:", error.message);
  }
};

export default connectDB;
