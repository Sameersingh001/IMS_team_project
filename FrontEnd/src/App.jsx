import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicationForm from "./pages/Intern/ApplicationForm";
import HomePage from "./pages/Landing/Home";
import RegisterPage from "./Authentication/RegisterForm";
import LoginPage from "./Authentication/LoginForm";
import HrDashboard from "./pages/HR/HrDashboard"
import InternDetail from "./pages/Intern/InternProfile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import InternInchargeRegister from "./Authentication/InternInchargeRegister";
import InternInchargeLogin from "./Authentication/InternInchargeLogin";
import InternInchargeDashboard from "./pages/Incharge/InchargeDashboard";
import InternInchargeProfile from "./pages/Incharge/InchargeProfile";
import AttendaceAdminPage from "./pages/Admin/AttendaceAdminPage";

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/intern-incharge-register" element={<InternInchargeRegister />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/intern-incharge-login" element={<InternInchargeLogin />} />


        <Route path="/HR-Dashboard" element={<HrDashboard />} />
        <Route path="/intern-incharge-dashboard" element={<InternInchargeDashboard />} />


        <Route path="/HR-Dashboard/intern/:id" element={<InternDetail role="HR" />} />
        <Route path="/Admin-Dashboard/incharge/:id" element={<InternInchargeProfile />} />
        <Route path="/Admin-Dashboard/intern/:id" element={<InternDetail role="Admin" />} />
        <Route path="/Admin-Dashboard" element={<AdminDashboard />} />
        <Route path="/Admin-Dashboard/attendance" element={<AttendaceAdminPage />} />
        <Route
          path="*"
          element={
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-purple-200 p-6 text-center">
              <h1 className="text-red-600 font-extrabold text-[8vw] md:text-[6rem]">404</h1>
              <h2 className="text-gray-800 font-semibold text-2xl md:text-4xl mt-2">Page Not Found</h2>
              <p className="text-gray-600 text-sm md:text-lg mt-2 max-w-md">
                The page you are looking for does not exist. Go back to the homepage.
              </p>
              <a
                href="/"
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Go Home
              </a>
            </div>
          }
        />
      </Routes>

    </Router>
  );
}

export default App;
