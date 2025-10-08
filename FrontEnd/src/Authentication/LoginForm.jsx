import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
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
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm">Login to your account</p>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Login successful! Redirecting...
          </div>
        )}

        {/* Login Form */}
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
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition duration-200"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
