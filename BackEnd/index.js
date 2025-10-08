import express from "express";
const app = express();
import ConnectDB from "./config/DB.js";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
app.use(cors());
const PORT = process.env.PORT || 8000;

app.use(express.json());

// import authRoutes from "./routers/authRoutes.js";
// import internRoutes from "./routes/internRoutes.js";

import authRoutes from './routers/AuthRoutes.js'
import internRoutes from './routers/InternRoutes.js'
import hrRoutes from './routers/HrRoutes.js'


// app.get("/", (req, res) => {
//   res.send("Welcome to the Intern Management System API");
// });

// connecting to database
ConnectDB();

// routers
app.use('/api', authRoutes);
app.use('/api', internRoutes);
app.use('/api', hrRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


