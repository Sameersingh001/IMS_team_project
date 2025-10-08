import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Graphura from "../../../public/GraphuraLogo.jpg";

const InternDetail = ({ role }) => {
  const { id } = useParams();
  const [intern, setIntern] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [generatingOffer, setGeneratingOffer] = useState(false);
  const navigate = useNavigate();

  const isAdmin = role === "Admin";

  useEffect(() => {
    fetchIntern();
  }, [id]);

  const fetchIntern = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = isAdmin ? `/api/admin/interns/${id}` : `/api/hr/interns/${id}`;
      const { data } = await axios.get(endpoint, {
        withCredentials: true,
      });
      setIntern(data);
    } catch (err) {
      console.error("Error fetching intern:", err);
      setError("Failed to load intern details");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!isAdmin) return;
    
    setUpdating(true);
    try {
      await axios.put(
        `/api/admin/interns/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      setIntern(prev => ({ ...prev, status: newStatus }));
      setUpdateSuccess("Status updated successfully!");
      setTimeout(() => setUpdateSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status");
    }
    setUpdating(false);
  };

  const handlePerformanceUpdate = async (newPerformance) => {
    if (!isAdmin) return;
    
    setUpdating(true);
    try {
      await axios.put(
        `/api/admin/interns/${id}/performance`,
        { performance: newPerformance },
        { withCredentials: true }
      );
      
      setIntern(prev => ({ ...prev, performance: newPerformance }));
      setUpdateSuccess("Performance updated successfully!");
      setTimeout(() => setUpdateSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating performance:", err);
      setError("Failed to update performance");
    }
    setUpdating(false);
  };

  const handleDomainUpdate = async (newDomain) => {
    if (!isAdmin) return;
    
    setUpdating(true);
    try {
      await axios.put(
        `/api/admin/interns/${id}/domain`,
        { domain: newDomain },
        { withCredentials: true }
      );
      
      setIntern(prev => ({ ...prev, domain: newDomain }));
      setUpdateSuccess("Domain updated successfully!");
      setTimeout(() => setUpdateSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating domain:", err);
      setError("Failed to update domain");
    }
    setUpdating(false);
  };

  const generateOfferLetter = async () => {
    if (!isAdmin) return;
    
    setGeneratingOffer(true);
    try {
      const response = await axios.post(
        `/api/admin/interns/${id}/generate`,
        {},
        { 
          withCredentials: true,  
          responseType: 'blob'
        }
      );

      // Create blob link and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `offer-letter-${intern.fullName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setUpdateSuccess("Offer letter generated successfully!");
      setTimeout(() => setUpdateSuccess(""), 3000);
    } catch (err) {
      console.error("Error generating offer letter:", err);
      setError("Failed to generate offer letter");
    }
    setGeneratingOffer(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected": return "bg-green-100 text-green-800 border-green-200";
      case "Rejected": return "bg-red-100 text-red-800 border-red-200";
      case "Applied": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Good": return "bg-green-100 text-green-800 border-green-200";
      case "Average": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Selected": return "✅";
      case "Rejected": return "❌";
      case "Applied": return "⏳";
      default: return "📄";
    }
  };

  const getPerformanceIcon = (performance) => {
    switch (performance) {
      case "Excellent": return "⭐";
      case "Good": return "👍";
      case "Average": return "📊";
      default: return "➖";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading intern details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Details</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchIntern}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(`/${role}-Dashboard`)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!intern) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Intern Not Found</h2>
          <p className="text-gray-600 mb-6">The requested intern details could not be found.</p>
          <button
            onClick={() => navigate(`/${role}-Dashboard`)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Group details into categories
  const personalDetails = [
    { label: "Full Name", value: intern.fullName, icon: "👤" },
    { label: "Email", value: intern.email, icon: "📧", isLink: true, href: `mailto:${intern.email}` },
    { label: "Mobile", value: intern.mobile, icon: "📱" },
  ];

  const educationDetails = [
    { label: "College", value: intern.college, icon: "🎓" },
    { label: "Course", value: intern.course, icon: "📚" },
  ];

  const internshipDetails = [
    { label: "Domain", value: intern.domain, icon: "💼" },
    { label: "Duration", value: intern.duration, icon: "⏱️" },
    { label: "Resume", value: "View Resume", icon: "📄", isLink: true, href: intern.resumeUrl },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={Graphura} 
                alt="Graphura Logo" 
                className="h-12 sm:h-16 rounded-lg"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Intern Details</h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {isAdmin ? "Admin - Full Management Access" : "HR - View Only Access"}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/${role}-Dashboard`)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative animate-fade-in">
            <span className="block sm:inline">{updateSuccess}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Status Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                📊 Application Status
              </h3>
              {isAdmin ? (
                <div className="space-y-3">
                  <select
                    value={intern.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updating}
                    className={`w-full border-2 rounded-xl p-3 text-center font-bold capitalize cursor-pointer transition-all ${getStatusColor(intern.status)} focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <div className="text-center text-sm text-gray-600">
                    {intern.status === 'Applied' && 'Application under review'}
                    {intern.status === 'Selected' && 'Candidate selected'}
                    {intern.status === 'Rejected' && 'Application rejected'}
                  </div>
                </div>
              ) : (
                <div className={`border-2 rounded-xl p-4 text-center ${getStatusColor(intern.status)}`}>
                  <div className="text-3xl mb-2">{getStatusIcon(intern.status)}</div>
                  <div className="text-xl font-bold capitalize">{intern.status}</div>
                  <div className="text-sm opacity-75 mt-1">
                    {intern.status === 'Applied' && 'Application under review'}
                    {intern.status === 'Selected' && 'Candidate selected'}
                    {intern.status === 'Rejected' && 'Application rejected'}
                  </div>
                </div>
              )}
            </div>

            {/* Performance Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                ⭐ Performance
              </h3>
              {isAdmin ? (
                <div className="space-y-3">
                  <select
                    value={intern.performance}
                    onChange={(e) => handlePerformanceUpdate(e.target.value)}
                    disabled={updating}
                    className={`w-full border-2 rounded-xl p-3 text-center font-bold capitalize cursor-pointer transition-all ${getPerformanceColor(intern.performance)} focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="Average">Average</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                  <div className="text-center text-sm text-gray-600">
                    {intern.performance === 'Excellent' && 'Outstanding performance'}
                    {intern.performance === 'Good' && 'Good performance'}
                    {intern.performance === 'Average' && 'Satisfactory performance'}
                  </div>
                </div>
              ) : (
                <div className={`border-2 rounded-xl p-4 text-center ${getPerformanceColor(intern.performance)}`}>
                  <div className="text-3xl mb-2">{getPerformanceIcon(intern.performance)}</div>
                  <div className="text-xl font-bold capitalize">{intern.performance}</div>
                  <div className="text-sm opacity-75 mt-1">
                    {intern.performance === 'Excellent' && 'Outstanding performance'}
                    {intern.performance === 'Good' && 'Good performance'}
                    {intern.performance === 'Average' && 'Satisfactory performance'}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Only - Offer Letter */}
            {isAdmin && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📝 Admin Actions
                </h3>
                <button
                  onClick={generateOfferLetter}
                  disabled={generatingOffer || intern.status !== "Selected"}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    intern.status === "Selected" 
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } ${generatingOffer ? "opacity-50" : ""}`}
                >
                  {generatingOffer ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      📄 Generate Offer Letter
                    </>
                  )}
                </button>
                {intern.status !== "Selected" && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Available only for selected interns
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Personal Details */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  👤 Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalDetails.map(({ label, value, icon, isLink, href }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-600">{label}</div>
                          {isLink ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 font-medium break-all transition-colors"
                            >
                              {value}
                            </a>
                          ) : (
                            <div className="text-gray-800 font-medium">{value || "Not provided"}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Details */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  🎓 Education Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {educationDetails.map(({ label, value, icon }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-600">{label}</div>
                          <div className="text-gray-800 font-medium">{value || "Not provided"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internship Details */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  💼 Internship Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {internshipDetails.map(({ label, value, icon, isLink, href }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-600">{label}</div>
                          {isLink ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 font-medium break-all transition-colors inline-flex items-center gap-1"
                            >
                              {value} ↗
                            </a>
                          ) : label === "Domain" && isAdmin ? (
                            <select
                              value={value}
                              onChange={(e) => handleDomainUpdate(e.target.value)}
                              disabled={updating}
                              className="text-gray-800 font-medium bg-transparent border-0 focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 cursor-pointer"
                            >
                              <option>Sales & Marketing</option>
                              <option>Email Outreaching</option>
                              <option>Journalism and Mass communication</option>
                              <option>Social Media Management</option>
                              <option>Graphic Design</option>
                              <option>Digital Marketing</option>
                              <option>Video Editing</option>
                              <option>Content Writing</option>
                              <option>UI/UX Designing</option>
                              <option>Front-end Developer</option>
                              <option>Back-end Developer</option>
                            </select>
                          ) : (
                            <div className="text-gray-800 font-medium">{value || "Not specified"}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${intern.email}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              📧 Send Email
            </a>
            <a
              href={intern.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              📄 View Resume
            </a>
            {isAdmin && (
              <button
                onClick={generateOfferLetter}
                disabled={generatingOffer || intern.status !== "Selected"}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  intern.status === "Selected" 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                {generatingOffer ? "⏳ Generating..." : "📝 Offer Letter"}
              </button>
            )}
            <button
              onClick={() => navigate(`/${role}-Dashboard`)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
            >
              ← Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDetail;