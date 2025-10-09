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
          <Route path="/Admin-Dashboard/intern/:id" element={<InternDetail role="Admin" />} />
          <Route path="/Admin-Dashboard" element={<AdminDashboard />} />

        </Routes>
    
    </Router>
  );
}

export default App;
