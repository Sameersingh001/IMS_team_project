import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Graphura from "../../../public/GraphuraLogo.jpg";

const AdminDashboard = () => {
  const [interns, setInterns] = useState([]);
  const [departmentIncharges, setDepartmentIncharges] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [performance, setPerformance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [showEmailCopy, setShowEmailCopy] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState("interns"); // "interns" or "incharges"
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "interns") {
        fetchInterns();
      } else {
        fetchDepartmentIncharges();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, status, performance, activeTab]);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/interns", {
        params: { search, status, performance },
        withCredentials: true,
      });
      setInterns(data.interns || []);
    } catch (err) {
      console.error("Error fetching interns:", err);
      setError("Failed to load interns");
    }
    setLoading(false);
  };

  const fetchDepartmentIncharges = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/department-incharges", {
        withCredentials: true,
      });
      setDepartmentIncharges(data.incharges || []);
    } catch (err) {
      console.error("Error fetching department incharges:", err);
      setError("Failed to load department incharges");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (internId, newStatus) => {
    setUpdating(internId);
    try {
      await axios.put(
        `/api/admin/interns/${internId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      await fetchInterns();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status");
    }
    setUpdating(null);
  };

  const handlePerformanceUpdate = async (internId, newPerformance) => {
    setUpdating(internId);
    try {
      await axios.put(
        `/api/admin/interns/${internId}/performance`,
        { performance: newPerformance },
        { withCredentials: true }
      );
      await fetchInterns();
    } catch (err) {
      console.error("Error updating performance:", err);
      setError("Failed to update performance");
    }
    setUpdating(null);
  };

  const handleDomainUpdate = async (internId, newDomain) => {
    setUpdating(internId);
    try {
      await axios.put(
        `/api/admin/interns/${internId}/domain`,
        { domain: newDomain },
        { withCredentials: true }
      );
      await fetchInterns();
    } catch (err) {
      console.error("Error updating domain:", err);
      setError("Failed to update domain");
    }
    setUpdating(null);
  };

  const handleDeleteIntern = async (internId) => {
    setUpdating(internId);
    try {
      await axios.delete(`/api/admin/interns/${internId}`, {
        withCredentials: true
      });
      setShowDeleteConfirm(null);
      await fetchInterns();
    } catch (err) {
      console.error("Error deleting intern:", err);
      setError("Failed to delete intern");
    }
    setUpdating(null);
  };

  const handleDeleteIncharge = async (inchargeId) => {
    setUpdating(inchargeId);
    try {
      await axios.delete(`/api/admin/department-incharges/${inchargeId}`, {
        withCredentials: true
      });
      setShowDeleteConfirm(null);
      await fetchDepartmentIncharges();
    } catch (err) {
      console.error("Error deleting department incharge:", err);
      setError("Failed to delete department incharge");
    }
    setUpdating(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/admin/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    const title = activeTab === "interns"
      ? "Admin Dashboard - Interns Report"
      : "Admin Dashboard - Department Incharges Report";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px;
              color: #333;
            }
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .print-header h1 {
              margin: 0 0 10px 0;
              color: #1f2937;
            }
            .print-header p {
              margin: 0;
              color: #6b7280;
            }
            .print-stats {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-card {
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              border: 1px solid #e5e7eb;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #7c3aed;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .status-badge, .performance-badge {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-Applied { 
              background-color: #dbeafe; 
              color: #1e40af; 
            }
            .status-Selected { 
              background-color: #dcfce7; 
              color: #166534; 
            }
            .status-Rejected { 
              background-color: #fee2e2; 
              color: #991b1b; 
            }
            .status-Active { 
              background-color: #dcfce7;
              color: #166534;
            }
            .status-Inactive { 
              background-color: #f3f4f6;
              color: #4b5563;
            }
            .status-Completed { 
              background-color: #f0fdf4;
              color: #166534;
            }
            .performance-Average { 
              background-color: #fef3c7; 
              color: #92400e; 
            }
            .performance-Good { 
              background-color: #dcfce7; 
              color: #166534; 
            }
            .performance-Excellent { 
              background-color: #e0e7ff; 
              color: #3730a3; 
            }
            .print-footer {
              margin-top: 30px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Graphura - Admin Dashboard Report</h1>
            <p>${activeTab === "interns" ? "Intern Applications and Performance Report" : "Department Incharges Management Report"}</p>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          ${printContent.innerHTML}
          
          <div class="print-footer">
            <p>Confidential - For Admin Use Only</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const getSelectedInternsEmails = () => {
    const selectedInterns = interns.filter(intern => intern.status === "Selected");
    return selectedInterns
      .map(intern => intern.email)
      .filter(email => email)
      .join("; ");
  };

  const copySelectedEmails = async () => {
    const emails = getSelectedInternsEmails();
    if (!emails) {
      setCopySuccess("No selected interns found to copy emails");
      setTimeout(() => setCopySuccess(""), 3000);
      return;
    }

    try {
      await navigator.clipboard.writeText(emails);
      setCopySuccess("✅ Emails copied to clipboard!");
      setTimeout(() => setCopySuccess(""), 3000);
    } catch (err) {
      console.error("Failed to copy emails:", err);
      setCopySuccess("❌ Failed to copy emails");
      setTimeout(() => setCopySuccess(""), 3000);
    }
  };

  const openEmailClient = () => {
    const emails = getSelectedInternsEmails();
    if (!emails) {
      setCopySuccess("No selected interns found to email");
      setTimeout(() => setCopySuccess(""), 3000);
      return;
    }
    window.location.href = `mailto:${emails}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Applied": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent": return "bg-purple-100 text-purple-800";
      case "Good": return "bg-green-100 text-green-800";
      case "Average": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInterns = showSelectedOnly
    ? interns.filter(intern => intern.status === "Selected")
    : interns;

  const selectedCount = interns.filter(intern => intern.status === "Selected").length;

  // Render Department Incharges Table
  const renderInchargesTable = () => (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <tr>
            <th className="p-4 text-left font-semibold">Name</th>
            <th className="p-4 text-left font-semibold">Email</th>
            <th className="p-4 text-left font-semibold">Departments</th>
            <th className="p-4 text-left font-semibold">Mobile</th>
            <th className="p-4 text-left font-semibold">Status</th>
            <th className="p-4 text-left font-semibold no-print">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {departmentIncharges.map((incharge) => (
            <tr key={incharge._id} className="hover:bg-blue-50 transition-colors duration-150">
              <td className="p-4">
                <div className="font-semibold text-gray-800">{incharge.fullName}</div>
              </td>
              <td className="p-4">
                <div className="text-gray-700">{incharge.email}</div>
              </td>
              <td className="p-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {incharge.departments || "Not specified"}
                </span>
              </td>
              <td className="p-4">
                <div className="text-gray-700">📞 {incharge.mobile || "Not provided"}</div>
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${incharge.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                  }`}>
                  {incharge.status || "Active"}
                </span>
              </td>
              <td className="p-4 no-print">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/Admin-Dashboard/incharge/${incharge._id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(`incharge-${incharge._id}`)}
                    disabled={updating === incharge._id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm disabled:opacity-50"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-4">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img src={Graphura} alt="Graphura Logo" className="sm:h-12 h-8 mr-5" />
                <div>
                  <h1 className="sm:text-2xl text-s font-bold text-gray-800">Admin Dashboard </h1>
                  <p className="text-gray-600 sm:text-sm text-xs">Full control over intern and department incharge management</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg no-print"
              >
                📄 Print Report
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg no-print"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Email Copy Success Message */}
        {copySuccess && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative animate-fade-in">
            <span className="block sm:inline">{copySuccess}</span>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this {showDeleteConfirm.includes('incharge-') ? 'department incharge' : 'intern'}? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showDeleteConfirm.includes('incharge-')) {
                      handleDeleteIncharge(showDeleteConfirm.replace('incharge-', ''));
                    } else {
                      handleDeleteIntern(showDeleteConfirm);
                    }
                  }}
                  disabled={updating === showDeleteConfirm.replace('incharge-', '')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {updating === showDeleteConfirm.replace('incharge-', '') ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-2xl p-6" ref={printRef}>
          {/* Tab Navigation */}
          <div className="mb-6 no-print">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("interns")}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "interns"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                👥 Intern Management
              </button>
              <button
                onClick={() => setActiveTab("incharges")}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "incharges"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                🏢 Department Incharges
              </button>
            </div>
          </div>

          {/* Interns Tab Content */}
          {activeTab === "interns" && (
            <>
              {/* Filters Section for Interns */}
              <div className="mb-8 no-print">
                {interns.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-7 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{interns.length}</div>
                      <div className="text-sm text-purple-800">Total Interns</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedCount}</div>
                      <div className="text-sm text-green-800">Selected</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {interns.filter(i => i.status === 'Rejected').length}
                      </div>
                      <div className="text-sm text-red-800">Rejected</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {interns.filter(i => i.performance === 'Excellent').length}
                      </div>
                      <div className="text-sm text-purple-800">Excellent</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {interns.filter(i => i.performance === 'Good').length}
                      </div>
                      <div className="text-sm text-orange-800">Good</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {interns.filter(i => i.status === 'Applied').length}
                      </div>
                      <div className="text-sm text-yellow-800">Pending</div>
                    </div>
                    <div
                      className="bg-indigo-50 rounded-lg p-4 text-center cursor-pointer hover:bg-indigo-100 transition-colors border-2 border-indigo-200"
                      onClick={() => setShowEmailCopy(!showEmailCopy)}
                    >
                      <div className="text-2xl font-bold text-indigo-600">📧</div>
                      <div className="text-sm text-indigo-800">Email Tools</div>
                    </div>
                  </div>
                )}

                {/* Email Tools Panel */}
                {showEmailCopy && selectedCount > 0 && (
                  <div className="mt-4 bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                      📧 Email Selected Interns ({selectedCount})
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={copySelectedEmails}
                        className="px-4 py-2 bg-white text-indigo-700 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors font-medium flex items-center gap-2"
                      >
                        📋 Copy All Emails
                      </button>
                      <button
                        onClick={openEmailClient}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                      >
                        ✉️ Open Email Client
                      </button>
                      <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-indigo-200 text-sm text-gray-600 flex items-center">
                        <span className="truncate">{getSelectedInternsEmails()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <h2 className="text-xl mt-4 font-semibold text-gray-800 mb-4">Filters & Search</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="🔍 Search by name, email, or domain..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Status</option>
                    <option value="Applied">Applied</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <select
                    value={performance}
                    onChange={(e) => setPerformance(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Performance</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                  </select>

                  <button
                    onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                    className={`border rounded-xl px-4 py-3 font-medium transition-all duration-200 ${showSelectedOnly
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                  >
                    {showSelectedOnly ? '✅ Showing Selected' : '👥 Show All'}
                  </button>
                </div>

                {/* Selected Only Notice */}
                {showSelectedOnly && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span className="text-green-800 font-medium">
                        Showing only selected interns ({filteredInterns.length})
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSelectedOnly(false)}
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      Show All
                    </button>
                  </div>
                )}
              </div>

              {/* Intern Table */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={fetchInterns}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 no-print"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredInterns.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
                      <tr>
                        <th className="p-4 text-left font-semibold">Intern Details</th>
                        <th className="p-4 text-left font-semibold">Contact Info</th>
                        <th className="p-4 text-left font-semibold">Domain & Duration</th>
                        <th className="p-4 text-left font-semibold">Status</th>
                        <th className="p-4 text-left font-semibold">Performance</th>
                        <th className="p-4 text-left font-semibold">Domain</th>
                        <th className="p-4 text-left font-semibold no-print">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredInterns.map((intern) => (
                        <tr key={intern._id} className="hover:bg-purple-50 transition-colors duration-150">
                          <td className="p-4">
                            <div>
                              <div className="font-semibold text-gray-800">{intern.fullName}</div>
                              <div className="text-sm text-gray-600">{intern.email}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-700">📞 {intern.mobile || "Not provided"}</div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="inline-block bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
                                {intern.domain || "Not specified"}
                              </span>
                              <div className="text-sm text-gray-600">
                                ⏱️ {intern.duration || "Not specified"}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="print-only">
                              <span className={`status-badge status-${intern.status}`}>
                                {intern.status}
                              </span>
                            </div>
                            <select
                              value={intern.status}
                              onChange={(e) => handleStatusUpdate(intern._id, e.target.value)}
                              disabled={
                                updating === intern._id ||
                                ["Active", "Inactive", "Completed"].includes(intern.status)
                              }
                              className={`${getStatusColor(intern.status)} px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-purple-500 cursor-pointer no-print`}
                            >
                              <option value="Applied">Applied</option>
                              <option value="Selected">Selected</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>

                          <td className="p-4">
                            <div className="print-only">
                              <span className={`performance-badge performance-${intern.performance}`}>
                                {intern.performance}
                              </span>
                            </div>
                            <select
                              value={intern.performance}
                              onChange={(e) => handlePerformanceUpdate(intern._id, e.target.value)}
                              disabled={updating === intern._id}
                              className={`${getPerformanceColor(intern.performance)} px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-purple-500 cursor-pointer no-print`}
                            >
                              <option value="Good">Good</option>
                              <option value="Excellent">Excellent</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="print-only">
                              <span>{intern.domain}</span>
                            </div>
                            <select
                              value={intern.domain}
                              onChange={(e) => handleDomainUpdate(intern._id, e.target.value)}
                              disabled={updating === intern._id}
                              className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-purple-500 cursor-pointer no-print`}
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
                          </td>
                          <td className="p-4 no-print">
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/Admin-Dashboard/intern/${intern._id}`)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(intern._id)}
                                disabled={updating === intern._id}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm disabled:opacity-50"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">
                    {showSelectedOnly ? "✅" : "👥"}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {showSelectedOnly ? "No selected interns found" : "No interns found"}
                  </h3>
                  <p className="text-gray-500">
                    {showSelectedOnly
                      ? "There are no interns with 'Selected' status"
                      : "Try adjusting your search or filters"
                    }
                  </p>
                  {showSelectedOnly && (
                    <button
                      onClick={() => setShowSelectedOnly(false)}
                      className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Show All Interns
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Department Incharges Tab Content */}
          {activeTab === "incharges" && (
            <>
              {/* Stats for Department Incharges */}
              {departmentIncharges.length > 0 && (
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{departmentIncharges.length}</div>
                    <div className="text-sm text-blue-800">Total Incharges</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {departmentIncharges.filter(i => i.status === 'Active').length}
                    </div>
                    <div className="text-sm text-green-800">Active</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {[...new Set(departmentIncharges.map(i => i.departments))].length}
                    </div>
                    <div className="text-sm text-purple-800">Departments</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {departmentIncharges.filter(i => !i.status || i.status === 'Inactive').length}
                    </div>
                    <div className="text-sm text-orange-800">Inactive</div>
                  </div>
                </div>
              )}

              {/* Department Incharges Table */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={fetchDepartmentIncharges}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 no-print"
                  >
                    Retry
                  </button>
                </div>
              ) : departmentIncharges.length > 0 ? (
                renderInchargesTable()
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🏢</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Department Incharges Found</h3>
                  <p className="text-gray-500 mb-4">There are no department incharges registered yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;