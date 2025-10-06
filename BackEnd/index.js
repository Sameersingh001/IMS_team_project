import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;
app.use(express.json());

import ConnectDB from "./config/DB.js";

// app.get("/", (req, res) => {
//   res.send("Welcome to the Intern Management System API");
// });

// connecting to database
ConnectDB();


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


