import bcrypt from "bcrypt";
import User from "../models/UserDB.js";


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


