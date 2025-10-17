import React from "react";
import { Link } from "react-router-dom";
import Graphura from "/GraphuraLogo.jpg"

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Background Decorative Blobs - Mobile Optimized */}
      <div className="absolute -top-16 -left-16 w-72 h-72 sm:-top-24 sm:-left-24 sm:w-96 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 sm:opacity-30 animate-blob"></div>
      <div className="absolute top-1/4 -right-20 w-64 h-64 sm:top-1/3 sm:-right-32 sm:w-96 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 sm:opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/4 w-72 h-72 sm:bottom-0 sm:left-1/2 sm:w-96 sm:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 sm:opacity-30 animate-blob animation-delay-4000"></div>

      {/* Navbar - Mobile Optimized */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-white/20 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-sm sticky top-0 z-50">
        <img
          src={Graphura}
          alt="Graphura Logo"
          className="h-8 sm:h-10 lg:h-12 w-auto"
        />

        <div className="flex space-x-2 sm:space-x-4">
          <Link
            to="/login"
            className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-sm sm:text-base text-indigo-700 font-semibold border border-indigo-700 rounded-full hover:bg-indigo-700 hover:text-white transition-all duration-300 whitespace-nowrap"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            Register Now
          </Link>
        </div>
      </nav>

      {/* Hero Section - Fully Responsive */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Main Heading */}
<h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight drop-shadow-sm">
  Engage & Collaborate With{" "}
  <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
    Your Intern Community
  </span>
</h2>

<p className="text-gray-700 text-base sm:text-lg lg:text-xl max-w-xs xs:max-w-sm sm:max-w-xl lg:max-w-2xl mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
  Foster meaningful connections while efficiently managing internship programs. Track progress, provide mentorship, and build lasting professional relationships.
</p>

        {/* Main CTA Buttons */}
        <div className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 w-full max-w-xs xs:max-w-none">
          <Link
            to="/apply"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 text-center"
          >
            Apply for InternShip
          </Link>
          <Link
            to="/login"
            className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-indigo-600 text-indigo-600 rounded-full text-base sm:text-lg font-medium hover:bg-indigo-50 hover:scale-105 transition-transform duration-300 text-center"
          >
            Login
          </Link>
        </div>

        {/* InternIncharge Specific Links */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/30 w-full max-w-xs xs:max-w-sm sm:max-w-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            Are you an Intern Incharge?
          </h3>
          <div className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/intern-incharge-login"
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 text-center whitespace-nowrap"
            >
              Intern Incharge Login
            </Link>
            <Link
              to="/intern-incharge-register"
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 text-center whitespace-nowrap"
            >
              Register as Incharge
            </Link>
          </div>
        </div>

        {/* Additional Features Grid for Larger Screens */}
        <div className=" lg:grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl w-full">
          {/* HR Management Tools */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-3 text-lg">HR Dashboard</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Centralized control panel for managing all intern profiles, documents, and organizational structure
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Bulk Upload</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Team Management</span>
            </div>
          </div>

          {/* Admin Control Tools */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-green-600 text-xl">⚙️</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-3 text-lg">Admin Controls</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Advanced system configuration, permissions, and administrative oversight for intern programs
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Permissions</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Settings</span>
            </div>
          </div>

          {/* Analytics & Reporting */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/30 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-purple-600 text-xl">📈</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-3 text-lg">Advanced Analytics</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Comprehensive reporting, performance metrics, and data-driven insights for program optimization
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Reports</span>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Analytics</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-md text-center py-3 sm:py-4 text-gray-600 text-xs sm:text-sm border-t border-white/30 mt-auto">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">Graphura Private Limited</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;