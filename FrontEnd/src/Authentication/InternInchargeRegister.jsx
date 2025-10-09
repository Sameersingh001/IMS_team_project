import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Graphura from "../../public/loginPNG.webp"

const InternInchargeRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        department: "", // Single department for registration
        gender: "",
        address: "",
        city: "",
        state: "",
        pinCode: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const departments = [
        "Sales & Marketing",
        "Email Outreaching",
        "Journalism and Mass communication",
        "Social Media Management",
        "Graphic Design",
        "Digital Marketing",
        "Video Editing",
        "Content Writing",
        "UI/UX Designing",
        "Front-end Developer",
        "Back-end Developer"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }
        if (!formData.mobile.match(/^[0-9]{10}$/)) {
            setError("Please enter a valid 10-digit mobile number");
            return false;
        }
        if (formData.pinCode && !formData.pinCode.match(/^[1-9][0-9]{5}$/)) {
            setError("Please enter a valid 6-digit pin code");
            return false;
        }
        if (!formData.department) {
            setError("Please select a department");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            // Convert to array format for backend (single department in array)
            const submitData = {
                ...formData,
                department: [formData.department] // Convert to array for backend
            };

            const response = await axios.post(
                "/api/intern-incharge/register",
                submitData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 201) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/intern-incharge-login");
                }, 2000);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
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


            <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-2">
                        Register as Intern Incharge
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Create your account to manage interns
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        Registration successful! Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                required
                                disabled={loading}
                            />
                        </div>

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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="10-digit mobile number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Department - Single Selection */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                Department *
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                required
                                disabled={loading}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                You can be assigned more departments by admin later
                            </p>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                Gender *
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                required
                                disabled={loading}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
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
                                    placeholder="Enter password"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                disabled={loading}
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Enter your city"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                disabled={loading}
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Enter your state"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                disabled={loading}
                            />
                        </div>

                        {/* Pin Code */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                Pin Code
                            </label>
                            <input
                                type="text"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                placeholder="6-digit pin code"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 bg-gray-50"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
                    >
                        {loading ? "Registering..." : "Register as Intern Incharge"}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-6 space-y-2">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/intern-incharge-login"
                            className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition duration-200"
                        >
                            Login here
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

export default InternInchargeRegister;