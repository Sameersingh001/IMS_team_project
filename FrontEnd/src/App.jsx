import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicationForm from "./pages/Intern/ApplicationForm";
import HomePage from "./pages/Landing/Home";
import RegisterPage from "./Authentication/RegisterForm";

function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
    
    </Router>
  );
}

export default App;
