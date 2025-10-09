import InternIncharge from "../models/InternHead.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerInternIncharge = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      department,
      gender,
      address,
      city,
      state,
      pinCode,
    } = req.body;

    // 1️⃣ Check required fields
    if (!fullName || !email || !password || !mobile || !department || !gender) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await InternIncharge.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create new Intern Incharge
    const newIncharge = await InternIncharge.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      department,
      gender,
      address,
      city,
      state,
      pinCode,
    });

    res.status(201).json({
      message: "Intern Incharge registered successfully",
      user: {
        id: newIncharge._id,
        fullName: newIncharge.fullName,
        email: newIncharge.email,
        department: newIncharge.department,
      },
    });
  } catch (error) {
    console.error("❌ Error registering Intern Incharge:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// 🔐 JWT Generator
export const loginInternIncharge = async (req, res) => {
  try {
    const { email, password } = req.body;
    // ✅ Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // ✅ Step 2: Find intern incharge
    const internIncharge = await InternIncharge.findOne({ email });
    if (!internIncharge) 
      return res.status(401).json({success: false, message: "Invalid email or password",});
    

    // ✅ Step 3: Compare password
    const isPasswordValid = await bcrypt.compare(password, internIncharge.password);
   if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials." });

    // ✅ Step 4: Check account status
    if (internIncharge.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact administrator.",
      });
    }

    // ✅ Step 5: Generate JWT (inline)
    const token = jwt.sign(
      { id: internIncharge._id, role: internIncharge.role || "InternIncharge" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // ✅ Step 6: Prepare response data (omit password)
    const userData = {
      _id: internIncharge._id,
      fullName: internIncharge.fullName,
      email: internIncharge.email,
      mobile: internIncharge.mobile,
      department: internIncharge.department,
      gender: internIncharge.gender,
      role: internIncharge.role || "InternIncharge",
      status: internIncharge.status || "Active",
      createdAt: internIncharge.createdAt,
    };

    // ✅ Step 7: Set secure cookie
    res.cookie("internIncharge_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // ✅ Step 8: Success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });

  } catch (error) {
    console.error("⚠️ Intern Incharge Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};


// @desc    Check Intern Incharge Authentication
// @route   GET /api/intern-incharge/check-auth
// @access  Private
export const checkInternInchargeAuth = async (req, res) => {
  try {
    const token = req.cookies.internIncharge_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "intern_incharge_secret");
    
    // Find user
    const internIncharge = await InternIncharge.findById(decoded.id).select("-password");

    if (!internIncharge) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid"
      });
    }

    // Check if account is active
    if (internIncharge.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: internIncharge._id,
        fullName: internIncharge.fullName,
        email: internIncharge.email,
        mobile: internIncharge.mobile,
        department: internIncharge.department,
        gender: internIncharge.gender,
        role: internIncharge.role,
        status: internIncharge.status,
        assignedInterns: internIncharge.assignedInterns
      }
    });

  } catch (error) {
    console.error("Check Auth Error:", error);
    res.status(401).json({
      success: false,
      message: "Token is not valid"
    });
  }
};

// @desc    Logout Intern Incharge
// @route   POST /api/intern-incharge/logout
// @access  Private
export const logoutInternIncharge = async (req, res) => {
  try {
    res.clearCookie("internIncharge_token");
    
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout"
    });
  }
};



