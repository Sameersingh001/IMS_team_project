import React from "react";
import { Link } from "react-router-dom";
import Graphura from "/GraphuraLogo.jpg"

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-full h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/60 border-b border-white/20 flex justify-between items-center px-8 py-4 shadow-sm sticky top-0 z-50">
            {/* screen logo */}
            <img src={Graphura} alt="Graphura Logo" className="h-12" />
       
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-5 py-2.5 text-indigo-700 font-semibold border border-indigo-700 rounded-full hover:bg-indigo-700 hover:text-white transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Register Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6 relative z-10">
        <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight drop-shadow-sm">
          Manage Interns With <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Ease and Efficiency
          </span>
        </h2>
        <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mb-10">
          A centralized platform to onboard, track, and evaluate interns seamlessly — built for modern organizations.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/register"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-full text-lg font-medium hover:bg-indigo-50 hover:scale-105 transition-transform duration-300"
          >
            Login
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-md text-center py-4 text-gray-600 text-sm border-t border-white/30">
        © {new Date().getFullYear()} <span className="font-semibold">Intern Management System</span>. All rights reserved.
      </footer>

      
    </div>
  );
};

export default HomePage;
