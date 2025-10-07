import bcrypt from "bcrypt";
import User from "../models/UserDB.js";
import jwt from "jsonwebtoken";



export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, secretKey } = req.body;

    // ✅ Basic validation
    if (!fullName || !email || !password || !role || !secretKey) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Validate secret key based on role
    if (role === "Admin" && secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: "Invalid Admin secret key." });
    } else if (role === "HR" && secretKey !== process.env.HR_SECRET_KEY) {
      return res.status(403).json({ message: "Invalid HR secret key." });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "Registration successful!", user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


//Login user (HR/Admin)
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // ✅ Basic validation
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All field  are required." });
    }
    // ✅ Check if user exists
    const user = await User.find({ email, role });
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    // ✅ Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    // ✅ Successful login
    // Generate JWT Token
    const token = jwt.sign({ id: user[0]._id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return res.status(200).json({ message: "Login successful!", user: user, token: token });
    
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


