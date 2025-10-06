import express from "express";
import ConnectDB from "./config/DB.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
app.use(cors());

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

import ConnectDB from "./config/DB.js";

// app.get("/", (req, res) => {
//   res.send("Welcome to the Intern Management System API");
// });

// connecting to database
ConnectDB();

// routers

app.use('/api', internRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


