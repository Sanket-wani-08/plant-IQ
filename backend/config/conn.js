import mongoose from "mongoose";
import dns from "dns";
import "dotenv/config";

dns.setServers(["1.1.1.1"]);

export const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected Sucessfully");
  } catch (error) {
    console.log("MongoDB connection failed :", error);
  }
};
