import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Mail } from "lucide-react";
import loginPng from "/loginPNG.webp";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "HR", // default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ✅ Check if already logged in via cookie
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const res = await axios.get("/api/check-auth", {
          withCredentials: true, // important for cookies
        });
        if (res.status === 200 && res.data.user) {
          const role = res.data.user.role;
          if (role === "Admin") navigate("/Admin-Dashboard");
          else navigate("/HR-Dashboard");
        }
      } catch (err) {
        console.log("No active session, stay on login.", err);
      }
    };
    checkUserAuth();
  }, [navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post(
        "/api/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // send cookie from backend
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setSuccess("User Login Successfully");

        const { user } = response.data;

        // Optional: Save user info locally
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on role
        setTimeout(() => {
          if (user.role === "Admin") navigate("/Admin-Dashboard");
          else navigate("/HR-Dashboard");
        }, 1000);
      }
    } catch (err) {
      if (err.response?.status === 401)
        setError("Invalid email or password!");
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Forgot Password - Send OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/forgot-password", {
        email: forgotPasswordEmail,
        role: formData.role
      });

      if (response.status === 200) {
        setOtpSent(true);
        setCountdown(60); // 60 seconds countdown
        setSuccess("OTP sent to your email!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/verify-otp", {
        email: forgotPasswordEmail,
        otp: otp
      });

      if (response.status === 200) {
        setOtpVerified(true);
        setSuccess("OTP verified! Please set your new password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // ✅ Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setForgotPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long!");
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/reset-password", {
        email: forgotPasswordEmail,
        otp: otp,
        newPassword: newPassword
      });

      if (response.status === 200) {
        setSuccess("Password reset successfully! You can now login with your new password.");
        setTimeout(() => {
          setShowForgotPassword(false);
          resetForgotPasswordStates();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // ✅ Reset forgot password states
  const resetForgotPasswordStates = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpSent(false);
    setOtpVerified(false);
    setCountdown(0);
    setError("");
  };

  // ✅ Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setForgotPasswordLoading(true);
    try {
      const response = await axios.post("/api/resend-otp", {
        email: forgotPasswordEmail
      });

      if (response.status === 200) {
        setCountdown(60);
        setSuccess("OTP resent to your email!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-around items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8 sm:py-12">
      {/* Left image */}
      <img
        src={loginPng}
        alt="Login Illustration"
        className="w-1/3 h-full object-cover rounded-3xl shadow-lg"
      />

      {/* Login form */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-2">
            {showForgotPassword ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-gray-600 text-sm">
            {showForgotPassword ? "Enter your email to reset password" : "Login to your account"}
          </p>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        {/* Forgot Password Flow */}
        {showForgotPassword ? (
          <div className="space-y-6">
            {/* Step 1: Email Input */}
            {!otpSent && (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                    required
                    disabled={forgotPasswordLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
                >
                  {forgotPasswordLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {otpSent && !otpVerified && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50 text-center text-lg font-mono"
                    required
                    maxLength={6}
                    disabled={forgotPasswordLoading}
                  />
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || forgotPasswordLoading}
                    className="text-indigo-600 hover:text-indigo-800 text-sm disabled:opacity-50"
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={forgotPasswordLoading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
                >
                  {forgotPasswordLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {otpVerified && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                    required
                    minLength={6}
                    disabled={forgotPasswordLoading}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                    required
                    minLength={6}
                    disabled={forgotPasswordLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
                >
                  {forgotPasswordLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Back to Login */}
            <div className="text-center">
              <button
                onClick={resetForgotPasswordStates}
                className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : (
          /* Original Login Form */
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Login As
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                  disabled={loading}
                >
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 mt-8 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition duration-200"
              >
                Register here
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;