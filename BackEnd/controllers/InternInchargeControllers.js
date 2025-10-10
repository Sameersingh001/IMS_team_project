import InternIncharge from "../models/InternHead.js"
import Intern from "../models/InternDatabase.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {transporter} from "../config/emailConfig.js"

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
      Secret_Key
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

    if(Secret_Key !== process.env.INCHARGE_SECRET_KEY){
      return res.status(400).json({ message: "Invalid Secret Key Please Contact to Admin" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create new Intern Incharge
    const newIncharge = await InternIncharge.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      departments : department,
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
      department: internIncharge.departments,
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
        department: internIncharge.departments,
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

export const DomainWiseInterns = async (req,res)=>{
    try {
    const incharge = await InternIncharge.findById(req.user._id);

    if (!incharge) {
      return res.status(404).json({ error: "Incharge not found" });
    }

    // Fetch interns that match ANY of the incharge’s departments
    
    const interns = await Intern.find({status : ["Active", "Inactive"], domain : incharge.departments})

    res.json({ interns});

  } catch (error) {
    console.error("Error fetching assigned interns:", error);
    res.status(500).json({ error: "Server error" });
  }
}




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


// 🔹 In-memory OTP store
const otpStore = new Map(); // key = email, value = { otp, expiresAt }

// ✅ Step 1: Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const incharge = await InternIncharge.findOne({ email });
    if (!incharge) {
      return res.status(404).json({ message: "No incharge found with this email." });
    }

    // Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    otpStore.set(email, { otp, expiresAt });
    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

    // Send OTP Email
    await transporter.sendMail({
      from: `"Graphura Intern System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - Intern Incharge",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; background:#f9fafb;">
          <h2 style="color:#4f46e5;">Graphura Intern System</h2>
          <p>Hello ${incharge.fullName || "Incharge"},</p>
          <p>Your OTP for resetting password is:</p>
          <h1 style="color:#16a34a; letter-spacing:4px;">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
          <p>Please do not share this code with anyone.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Error sending OTP. Please try again later." });
  }
};

// ✅ Step 2: Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore.get(email);

    if (!record) return res.status(400).json({ message: "OTP not found or expired." });
    if (record.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired." });
    }
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Error verifying OTP." });
  }
};

// ✅ Step 3: Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = otpStore.get(email);

    if (!record) return res.status(400).json({ message: "OTP not found or expired." });
    if (record.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired." });
    }
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

    const incharge = await InternIncharge.findOne({ email });
    if (!incharge) return res.status(404).json({ message: "Incharge not found." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    incharge.password = hashed;
    await incharge.save();

    otpStore.delete(email);
    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Error resetting password." });
  }
};

// ✅ Step 4: Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const incharge = await InternIncharge.findOne({ email });
    if (!incharge) return res.status(404).json({ message: "Incharge not found." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, { otp, expiresAt });
    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

    await transporter.sendMail({
      from: `"Graphura Intern System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Resend OTP - Intern Incharge",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <p>Your new OTP is:</p>
          <h2 style="color:#4f46e5;">${otp}</h2>
          <p>Valid for 5 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Error resending OTP." });
  }
};

