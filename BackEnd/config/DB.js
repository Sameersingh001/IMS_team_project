import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

 const ConnectDB= async ()=>{
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("MongoDB connected successfully");
        
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        
    }
}
export default ConnectDB;

