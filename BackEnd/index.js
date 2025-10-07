import express from "express";
import ConnectDB from "./config/DB.js";
import dotenv from "dotenv";
import cors from "cors";

// routers
import internRoutes from "./routers/internRoutes.js";
import authRoutes from "./routers/AuthRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


// app.get("/", (req, res) => {
//   res.send("Welcome to the Intern Management System API");
// });

// connecting to database
ConnectDB();

// routers
app.use('/api', authRoutes);
app.use('/api', internRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


