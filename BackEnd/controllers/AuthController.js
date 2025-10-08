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
    if (!email || !password || !role)
      return res.status(400).json({ message: "All fields are required." });

    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ message: "Login successful!", user, token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Check Auth (auto-login if cookie valid)
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User authenticated", user });
  } catch (err) {
    res.status(500).json({ message: "Error verifying user." });
  }
};

// ✅ Logout Controller
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully." });
};


