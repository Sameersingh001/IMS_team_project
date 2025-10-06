import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ApplicationForm from "./pages/Intern/ApplicationForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 p-4">
        <Routes>
          <Route path="/apply" element={<ApplicationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
