import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Graphura from "../../public/loginPNG.webp"

const InternInchargeLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ✅ Check if already logged in
    useEffect(() => {
        const checkInternInchargeAuth = async () => {
            try {
                const res = await axios.get("/api/intern-incharge/check-auth", {
                    withCredentials: true,
                });
                if (res.status === 200 && res.data.user) {
                    navigate("/intern-incharge-dashboard");
                }
            } catch (err) {
                console.log("No active session, stay on login.", err);
            }
        };
        checkInternInchargeAuth();
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
                "/api/incharge/login",
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                setSuccess(true);
                const { user } = response.data;

                // Save user info locally (optional)
                localStorage.setItem("internIncharge", JSON.stringify(user));

                // Redirect to intern incharge dashboard
                setTimeout(() => {
                    navigate("/intern-incharge-dashboard");
                }, 1000);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Invalid email or password!");
            } else if (err.response?.status === 403) {
                setError("Account is inactive. Please contact administrator.");
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-around bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8">

            <img
                src={Graphura}
                alt="Login Illustration"
                className="w-1/3 h-full object-cover rounded-3xl shadow-lg"
            />

            <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-md">


                <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-2">
                        Intern Incharge Login
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Access your intern management dashboard
                    </p>
                </div>

                {/* Error / Success Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        Login successful! Redirecting to dashboard...
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
                            placeholder="Enter your registered email"
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
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
                    >
                        {loading ? "Logging in..." : "Login as Intern Incharge"}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-8 space-y-3">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/intern-incharge-register"
                            className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition duration-200"
                        >
                            Register here
                        </Link>
                    </p>

                    <p className="text-gray-600 text-sm">
                        Are you HR or Admin?{" "}
                        <Link
                            to="/login"
                            className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition duration-200"
                        >
                            HR/Admin Login
                        </Link>
                    </p>

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

export default InternInchargeLogin;