import express from "express";
import ConnectDB from "./config/DB.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to the Intern Management System API");
});

// connecting to database
ConnectDB();


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


