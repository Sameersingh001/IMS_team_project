import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Graphura from "/GraphuraLogo.jpg";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const FeatureCard = ({ icon, title, description, tags, gradient, delay }) => (
    <div
      className={`bg-white/60 backdrop-blur-lg p-4 sm:p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group cursor-pointer ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      style={{
        animationDelay: `${delay}ms`,
        background: `linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)`
      }}
    >
      <div className={`w-12 h-12 sm:w-16 sm:h-16 ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-xl sm:text-2xl">{icon}</span>
      </div>
      <h4 className="font-bold text-gray-800 mb-2 sm:mb-3 text-base sm:text-lg group-hover:text-gray-900 transition-colors">{title}</h4>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-700 transition-colors line-clamp-3 sm:line-clamp-none">
        {description}
      </p>
      <div className="mt-3 sm:mt-4 flex justify-center space-x-1 sm:space-x-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-white/80 text-gray-700 text-xs px-2 sm:px-3 py-1 rounded-full border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const FloatingElement = ({ children, className, delay }) => (
    <div
      className={`absolute ${className} ${isVisible ? 'animate-float' : 'opacity-0'
        }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15), transparent 80%)`
        }}
      />

      {/* Enhanced Background Blobs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 sm:-top-32 sm:-left-32 sm:w-[500px] sm:h-[500px] bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 sm:opacity-25 animate-blob"></div>
      <div className="absolute top-1/3 -right-16 w-48 h-48 sm:top-1/3 sm:-right-40 sm:w-96 sm:h-96 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 sm:opacity-25 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-24 left-1/4 w-64 h-64 sm:-bottom-32 sm:left-1/2 sm:w-[500px] sm:h-[500px] bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 sm:opacity-25 animate-blob animation-delay-4000"></div>

      {/* Floating Elements */}
      <FloatingElement className="top-20 left-10 text-2xl" delay="200">🚀</FloatingElement>
      <FloatingElement className="top-40 right-16 text-xl" delay="600">💼</FloatingElement>
      <FloatingElement className="bottom-40 left-20 text-xl" delay="1000">🌟</FloatingElement>
      <FloatingElement className="bottom-20 right-24 text-2xl" delay="1400">🎯</FloatingElement>

      {/* Enhanced Navbar */}
      <nav className="backdrop-blur-lg bg-white/80 border-b border-white/30 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-lg sticky top-0 z-50 transition-all duration-300 hover:bg-white/90">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <img
            src={Graphura}
            alt="Graphura Logo"
            className="h-8 sm:h-10 lg:h-12 w-auto transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="flex space-x-2 sm:space-x-4">
          <Link
            to="/login"
            className="px-4 sm:px-5 py-2 text-sm sm:text-base text-indigo-700 font-semibold border-2 border-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
          >
            🔑 Login
          </Link>
          <Link
            to="/register"
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap shadow-md flex items-center space-x-2"
          >
            <span>✨</span>
            <span>Register</span>
          </Link>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">
        {/* Main Heading with Typing Effect */}
        <div className={`mb-4 sm:mb-6 lg:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
            Engage & Collaborate With{" "}
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2 sm:mt-3 animate-gradient-x">
              Your Intern Community
            </span>
          </h2>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className={`flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 w-full max-w-xs sm:max-w-none transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <Link
            to="/apply"
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 sm:px-10 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-center relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center space-x-3">
              <span>🎓</span>
              <span>Apply for Internship</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            to="/login"
            className="group px-6 sm:px-8 sm:px-10 py-3 sm:py-4 border-3 border-indigo-600 text-indigo-600 rounded-2xl text-base sm:text-lg font-bold hover:bg-indigo-600 hover:text-white transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-center shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center space-x-3">
              <span>🔐</span>
              <span>Login</span>
            </span>
          </Link>

          <Link
            to="/review-team-login"
            className="group px-6 sm:px-8 sm:px-10 py-3 sm:py-4 border-3 border-green-600 text-green-600 rounded-2xl text-base sm:text-lg font-bold hover:bg-green-600 hover:text-white transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-center shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center space-x-3">
              <span>👥</span>
              <span>Review Team</span>
            </span>
          </Link>
        </div>

        {/* Enhanced InternIncharge Section */}
        <div className={`mt-8 sm:mt-12 p-4 sm:p-6 bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-white/50 shadow-2xl w-full max-w-md sm:max-w-4xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-center space-x-3 flex-wrap">
            <span>👨‍💼</span>
            <span>Are you an Intern Incharge?</span>
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
            <Link
              to="/intern-incharge-login"
              className="group px-4 sm:px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 text-center flex items-center justify-center space-x-2"
            >
              <span>🚪</span>
              <span>Intern Incharge Login</span>
            </Link>
          <Link
            to="/intern-incharge-register"
            className="group px-4 sm:px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 text-center flex items-center justify-center space-x-2"
          >
            <span>📝</span>
            <span>Register as Incharge / Review </span>
          </Link>
        </div>
      </div>

      {/* Enhanced Features Grid */}
      {/* What Interns Gain Section */}
      <div
        className={`mt-12 sm:mt-16 lg:mt-20 lg:mt-24 max-w-5xl w-full text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6">
          What Interns Gain from This Internship
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg line-clamp-4 sm:line-clamp-none">
          Every intern at <span className="font-semibold text-indigo-600">Graphura</span> experiences
          a journey that blends learning, practical exposure, and personal growth.
          Here’s what you’ll take away from your internship with us.
        </p>

        {/* Benefits Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
          {[
            {
              emoji: "💻",
              title: "Hands-on Project Experience",
              desc: "Work on real-world projects that enhance your portfolio and showcase your practical skills in the tech industry.",
            },
            {
              emoji: "🧠",
              title: "Skill Development",
              desc: "Gain expertise in modern tools, technologies, and teamwork — all essential to become industry-ready.",
            },
            {
              emoji: "👨‍🏫",
              title: "Mentorship & Guidance",
              desc: "Learn directly from experienced professionals who guide you through challenges and career-building decisions.",
            },
            {
              emoji: "🏆",
              title: "Internship Certificate",
              desc: "Receive a verified internship certificate upon successful completion, validating your contribution and learning.",
            },
            {
              emoji: "🚀",
              title: "Career Growth Opportunities",
              desc: "Outstanding performers may receive pre-placement offers, letters of recommendation, or extended internships.",
            },
            {
              emoji: "🌐",
              title: "Professional Networking",
              desc: "Connect with like-minded peers, mentors, and industry experts — expanding your professional network for future opportunities.",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-lg p-4 sm:p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{benefit.emoji}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div
        className={`mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl w-full transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        {[
          {
            number: "500+",
            label: "Active Interns",
            subtext: "Learning with us now",
            emoji: "🎓",
            gradient: "from-blue-500 to-indigo-500",
          },
          {
            number: "50+",
            label: "Expert Mentors",
            subtext: "Guiding every step",
            emoji: "👨‍🏫",
            gradient: "from-green-500 to-emerald-500",
          },
          {
            number: "95%",
            label: "Success Rate",
            subtext: "Interns placed or certified",
            emoji: "📊",
            gradient: "from-purple-500 to-pink-500",
          },
          {
            number: "24/7",
            label: "Dedicated Support",
            subtext: "Always there for you",
            emoji: "🛠️",
            gradient: "from-orange-500 to-yellow-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/40 shadow-lg text-center group hover:scale-105 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
          >
            <div
              className={`absolute inset-0 opacity-10 bg-gradient-to-br ${stat.gradient} transition-all group-hover:opacity-20`}
            ></div>
            <div className="relative">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                {stat.emoji}
              </div>
              <div
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
              >
                {stat.number}
              </div>
              <div className="text-sm sm:text-base font-semibold text-gray-700 mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.subtext}</div>
            </div>
          </div>
        ))}
      </div>

      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white/80 backdrop-blur-lg text-center py-4 sm:py-6 text-gray-600 text-xs sm:text-sm border-t border-white/30 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Graphura India Private Limited
            </span>. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Building the future of internship management, one connection at a time.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
         0%, 100% { transform: translateY(0px) rotate(0deg); }
         50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
        }
        @keyframes gradient-x {
         0%, 100% { background-position: 0% 50%; }
         50% { background-position: 100% 50%; }
        }
        @keyframes blob {
         0% { transform: translate(0px, 0px) scale(1); }
         33% { transform: translate(30px, -50px) scale(1.1); }
         66% { transform: translate(-20px, 20px) scale(0.9); }
         100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-float {
         animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
         animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-gradient-x {
         background-size: 200% 200%;
         animation: gradient-x 3s ease infinite;
        }
        .animate-blob {
         animation: blob 7s infinite;
        }
        .animation-delay-2000 {
         animation-delay: 2s;
        }
        .animation-delay-4000 {
         animation-delay: 4s;
        }
        @media (max-width: 640px) {
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-4 {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
