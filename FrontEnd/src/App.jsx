import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicationForm from "./pages/Intern/ApplicationForm";
import HomePage from "./pages/Landing/Home";
import RegisterPage from "./Authentication/RegisterForm";
import LoginPage from "./Authentication/LoginForm";
import HrDashboard from "./pages/HR/HrDashboard"

function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/HR-Dashboard" element={<HrDashboard />} />

        </Routes>
    
    </Router>
  );
}

export default App;
