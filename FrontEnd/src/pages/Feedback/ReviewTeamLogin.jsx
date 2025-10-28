import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";

const ReviewTeamLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };



    useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get("/api/review-team/me", { withCredentials: true });
        if (response.data.member) {
          // User is logged in, redirect to dashboard
          navigate("/review-team-dashboard");
        } else {
          navigate("/review-team-login");
        }
      } catch (error) {
        console.error(error);
        navigate("/review-team-login");
      }
    };

    checkLogin();
  }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "/api/review-team/login",
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 200) {
                // Store token and redirect to dashboard
                localStorage.setItem("reviewTeamToken", response.data.token);
                localStorage.setItem("reviewTeamMember", JSON.stringify(response.data.member));
                navigate("/review-team/dashboard");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
            <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-blue-700 mb-2">
                        Review Team Login
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Access intern feedback dashboard
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 bg-gray-50"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 bg-gray-50"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-6 space-y-2">
                    <p className="text-gray-600 text-sm">
                        <Link
                            to="/"
                            className="text-gray-500 hover:text-gray-700 transition duration-200"
                        >
                            ← Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReviewTeamLogin;