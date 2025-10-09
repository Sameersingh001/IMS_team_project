import express from "express";
const app = express();
import ConnectDB from "./config/DB.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
app.use(cors());
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

// import authRoutes from "./routers/authRoutes.js";
// import internRoutes from "./routes/internRoutes.js";

import authRoutes from './routers/AuthRoutes.js'
import internRoutes from './routers/InternRoutes.js'
import hrRoutes from './routers/HrRoutes.js'
import adminRoutes from './routers/AdminRoutes.js'
import Incharge from "./routers/InchargeRoutes.js"


// app.get("/", (req, res) => {
//   res.send("Welcome to the Intern Management System API");
// });

// connecting to database
ConnectDB();

// routers
app.use('/api', authRoutes);
app.use('/api', internRoutes);
app.use('/api', hrRoutes);
app.use('/api', adminRoutes);
app.use("/api", Incharge)



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


