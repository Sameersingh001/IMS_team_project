import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  LogOut,
  User,
  Mail,
  Phone,
  BarChart3,
  Filter,
  Search,
  Menu,
  X,
  MessageCircle,
  Send,
  Trash2,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Building,
  Plus
} from "lucide-react";

const InternInchargeDashboard = () => {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceRemarks, setAttendanceRemarks] = useState({});
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [showMeetingsModal, setShowMeetingsModal] = useState(false);
  const [departmentMeetings, setDepartmentMeetings] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedMeetingDate, setSelectedMeetingDate] = useState("");
  const [meetingAttendanceData, setMeetingAttendanceData] = useState([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedInternForExtension, setSelectedInternForExtension] = useState(null);
  const [extendLoading, setExtendLoading] = useState(false);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const authRes = await axios.get("/api/intern-incharge/check-auth", {
        withCredentials: true,
      });

      if (authRes.status === 200 && authRes.data.user) {
        setUser(authRes.data.user);
        fetchAssignedInterns();
        console.log(authRes.data.user)
      }
    } catch (err) {
      console.log("Not authenticated, redirecting to login", err);
      navigate("/intern-incharge-login");
    }
  };

  const fetchDepartmentMeetings = async () => {
    try {
      setMeetingsLoading(true);
      const response = await axios.get('/api/intern-incharge/department-meeting-dates', {
        withCredentials: true,
      });

      if (response.data.success) {
        setDepartmentMeetings(response.data.departmentMeetings);

        // Auto-select first department if available
        const departments = Object.keys(response.data.departmentMeetings);
        if (departments.length > 0 && !selectedDepartment) {
          setSelectedDepartment(departments[0]);
          // Auto-select first date of the first department
          const firstDeptMeetings = response.data.departmentMeetings[departments[0]];
          if (firstDeptMeetings.length > 0) {
            setSelectedMeetingDate(firstDeptMeetings[0].date);
            fetchMeetingDetails(departments[0], firstDeptMeetings[0].date);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching department meetings:', error);
      alert('Failed to fetch department meetings');
    } finally {
      setMeetingsLoading(false);
    }
  };

  const fetchMeetingDetails = async (department, date) => {
    try {
      setMeetingsLoading(true);
      const response = await axios.get(`/api/intern-incharge/department-meeting-details?department=${department}&date=${date}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMeetingAttendanceData(response.data.attendanceRecords);
      }
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      alert('Failed to fetch meeting details');
    } finally {
      setMeetingsLoading(false);
    }
  };

  const fetchAssignedInterns = async () => {
    try {
      const response = await axios.get("/api/intern-incharge/assigned-interns", {
        withCredentials: true,
      });
      setInterns(response.data.interns || []);
    } catch (error) {
      console.error("Error fetching interns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/intern-incharge/logout", {}, { withCredentials: true });
      localStorage.removeItem("internIncharge");
      navigate("/intern-incharge-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAddComment = async (internId) => {
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await axios.post(
        `/api/intern-incharge/interns/${internId}/comments`,
        {
          comment: newComment
        },
        { withCredentials: true }
      );

      setInterns(prevInterns =>
        prevInterns.map(intern =>
          intern._id === internId
            ? {
              ...intern,
              comments: response.data.intern.comments
            }
            : intern
        )
      );

      setNewComment("");
      setShowCommentModal(false);
      alert("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (internId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await axios.delete(
        `/api/intern-incharge/interns/${internId}/comments/${commentId}`,
        { withCredentials: true }
      );

      window.location.reload()
      setInterns(prevInterns =>
        prevInterns.map(intern =>
          intern._id === internId
            ? {
              ...intern,
              comments: response.data.intern.comments
            }
            : intern
        )
      );

      alert("Comment deleted successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    }
  };

  const handleExtendInternship = async (internId, extendedDays) => {
    try {
      setExtendLoading(true);
      const response = await axios.post(
        `/api/intern-incharge/interns/${internId}/extend`,
        { extendedDays },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local state
        setInterns(prevInterns =>
          prevInterns.map(intern =>
            intern._id === internId
              ? { ...intern, extendedDays: response.data.intern.extendedDays }
              : intern
          )
        );
        
        setShowExtendModal(false);
        setSelectedInternForExtension(null);
        alert(`✅ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error extending internship:", error);
      alert(error.response?.data?.message || "Failed to extend internship");
    } finally {
      setExtendLoading(false);
    }
  };

  const openCommentModal = (intern) => {
    setSelectedIntern(intern);
    setNewComment("");
    setShowCommentModal(true);
  };

  const openExtendModal = (intern) => {
    setSelectedInternForExtension(intern);
    setShowExtendModal(true);
  };

  const openAttendanceModal = () => {
    setShowAttendanceModal(true);
    setSelectedDomain(user?.department?.[0] || "");

    // Initialize attendance status for active interns only
    const initialStatus = {};
    const initialRemarks = {};

    const activeInterns = getActiveInternsByDomain(user?.department?.[0] || "");
    activeInterns.forEach(intern => {
      initialStatus[intern._id] = "Absent"; // Default to Absent
      initialRemarks[intern._id] = ""; // Clear remarks
    });
    setAttendanceStatus(initialStatus);
    setAttendanceRemarks(initialRemarks);
  };

  const handleAttendanceSubmit = async () => {
    try {
      setAttendanceLoading(true);

      const activeInterns = getActiveInternsByDomain(selectedDomain);
      const attendanceData = activeInterns.map(intern => ({
        internId: intern._id,
        meetingDate: attendanceDate,
        status: attendanceStatus[intern._id] || "Absent",
        remarks: attendanceRemarks[intern._id] || ""
      }));

      const response = await axios.post(
        "/api/incharge/attendance",
        {
          attendanceDate,
          domain: selectedDomain,
          attendanceRecords: attendanceData,
          sendEmail: true
        },
        { withCredentials: true }
      );

      // Update local intern data
      if (response.data.updatedInterns && response.data.updatedInterns.length > 0) {
        setInterns(prevInterns =>
          prevInterns.map(intern => {
            const updatedIntern = response.data.updatedInterns.find(ui => ui._id === intern._id);
            return updatedIntern ? { ...intern, ...updatedIntern } : intern;
          })
        );
      }

      setShowAttendanceModal(false);

      const presentCount = attendanceData.filter(record => record.status === "Present").length;
      const absentCount = attendanceData.filter(record => record.status === "Absent").length;
      const leaveCount = attendanceData.filter(record => record.status === "Leave").length;

      // Create success message
      const successMessage = `✅ ${response.data.message || 'Attendance marked successfully!'}\n\n` +
        `📊 Summary:\n` +
        `• ✅ Present: ${presentCount} interns\n` +
        `• ❌ Absent: ${absentCount} interns\n` +
        `• 🟡 Leave: ${leaveCount} interns\n` +
        (`\n📧 Emails sent to All interns.`);

      alert(successMessage);

    } catch (err) {
      console.error("Error marking attendance:", err);

      if (err.response?.data?.message) {
        alert(`❌ ${err.response.data.message}`);
      } else {
        alert("❌ Failed to mark attendance. Please try again.");
      }
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Get active interns filtered by domain (incharge's department = intern's domain)
  const getActiveInternsByDomain = (domain) => {
    return interns.filter(intern =>
      intern.status === "Active" &&
      intern.domain === domain
    );
  };

  // Get unique domains for the incharge (their departments)
  const getInchargeDomains = () => {
    return user?.department || [];
  };

  // Get interns for attendance modal based on selected domain
  const getAttendanceInterns = () => {
    if (!selectedDomain) return [];
    return getActiveInternsByDomain(selectedDomain);
  };

  const getAttendanceStats = (intern) => {
    const total = intern.totalMeetings || 0;
    const attended = intern.meetingsAttended || 0;
    const leaves = intern.leavesTaken || 0;
    const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0;

    return { total, attended, leaves, attendanceRate };
  };

  const getCommentCount = (intern) => {
    return intern.comments ? intern.comments.length : 0;
  };

  // Filter interns based on search and domain
  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.uniqueId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain = !filterDomain || intern.domain === filterDomain;

    return matchesSearch && matchesDomain;
  });

  // Get unique domains for filter
  const domains = [...new Set(interns.map(intern => intern.domain).filter(domain => domain))];

  const PerformanceBadge = ({ performance }) => {
    const getPerformanceColor = (perf) => {
      switch (perf?.toLowerCase()) {
        case "excellent": return "bg-green-100 text-green-800";
        case "good": return "bg-blue-100 text-blue-800";
        case "average": return "bg-yellow-100 text-yellow-800";
        case "poor": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(performance)}`}>
        {performance || "Not Rated"}
      </span>
    );
  };

  const getFilteredStats = () => {
    const filteredInternsData = filteredInterns;

    const totalInterns = filteredInternsData.length;
    const activeInterns = filteredInternsData.filter(intern => intern.status === "Active").length;

    // Calculate average attendance for filtered interns
    const totalAttendanceRate = filteredInternsData.reduce((acc, intern) =>
      acc + getAttendanceStats(intern).attendanceRate, 0
    );
    const avgAttendance = totalInterns > 0 ? Math.round(totalAttendanceRate / totalInterns) : 0;

    // Get unique domains from filtered interns
    const filteredDomains = [...new Set(filteredInternsData.map(intern => intern.domain).filter(domain => domain))];

    return {
      totalInterns,
      activeInterns,
      domainsCount: filteredDomains.length,
      avgAttendance,
      filteredDomains
    };
  };

  const AttendanceBadge = ({ attendanceRate }) => {
    let colorClass = "bg-gray-100 text-gray-800";
    if (attendanceRate >= 90) colorClass = "bg-green-100 text-green-800";
    else if (attendanceRate >= 75) colorClass = "bg-blue-100 text-blue-800";
    else if (attendanceRate >= 60) colorClass = "bg-yellow-100 text-yellow-800";
    else if (attendanceRate > 0) colorClass = "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {attendanceRate}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 max-w-full overflow-x-hidden">
        {/* Header */}  
        <header className="bg-white shadow-sm border-b w-full">
          <div className="flex items-center justify-between p-4 w-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Incharge Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-blue-400">👋 {user?.fullName}</span>
              <button
                onClick={openAttendanceModal}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                <CheckCircle size={18} />
                <span>Mark Attendance</span>
              </button>
              <button
                onClick={() => {
                  setShowMeetingsModal(true);
                  fetchDepartmentMeetings();
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
              >
                <Calendar size={18} />
                <span>View All Meetings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4  w-full max-w-full">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interns</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {filterDomain ? getFilteredStats().totalInterns : interns.length}
                </p>
                {filterDomain && (
                  <p className="text-xs text-gray-500 mt-1">Filtered: {filterDomain}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Interns</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {filterDomain ? getFilteredStats().activeInterns : interns.filter(intern => intern.status === "Active").length}
                </p>
                {filterDomain && (
                  <p className="text-xs text-gray-500 mt-1">In selected domain</p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <User className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {filterDomain ? "Selected Domain" : "Domains"}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {filterDomain ? 1 : domains.length}
                </p>
                {filterDomain && (
                  <p className="text-xs text-gray-500 mt-1">{filterDomain}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {filterDomain ? getFilteredStats().avgAttendance :
                    interns.length > 0
                      ? Math.round(interns.reduce((acc, intern) => acc + getAttendanceStats(intern).attendanceRate, 0) / interns.length)
                      : 0
                  }%
                </p>
                {filterDomain && (
                  <p className="text-xs text-gray-500 mt-1">In selected domain</p>
                )}
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {filterDomain ? "Showing Domain" : "Your Domains"}
                </p>
                <div className="mt-1">
                  {filterDomain ? (
                    <p className="text-xs font-bold text-gray-800 truncate">{filterDomain}</p>
                  ) : (
                    user?.department?.map((domain, index) => (
                      <p key={index} className="text-xs font-bold text-gray-800 truncate">
                        {domain}
                      </p>
                    ))
                  )}
                </div>
                {filterDomain && (
                  <p className="text-xs text-gray-500 mt-1">Currently viewing</p>
                )}
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Building className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-6 mb-6  w-full max-w-full">
          <div className="bg-white rounded-xl shadow-sm p-4 border">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search interns by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Domain Filter */}
              <div className="w-full md:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={filterDomain}
                    onChange={(e) => setFilterDomain(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                  >
                    <option value="">All Domains</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filter Button - Only show when filter is active */}
              {(filterDomain || searchTerm) && (
                <div className="w-full md:w-auto">
                  <button
                    onClick={() => {
                      setFilterDomain("");
                      setSearchTerm("");
                    }}
                    className="w-full md:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Active Filter Indicator */}
            {filterDomain && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Showing data for: <strong>{filterDomain}</strong> domain
                    </span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {getFilteredStats().totalInterns} interns
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interns Table */}
        <div className="flex-1 w-full max-w-full">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intern Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Domain & Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterns.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        {interns.length === 0 ? "No interns assigned to you yet." : "No interns match your search criteria."}
                      </td>
                    </tr>
                  ) : (
                    filteredInterns.map((intern) => {
                      const stats = getAttendanceStats(intern);
                      return (
                        <tr key={intern._id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <User size={16} className="text-white" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{intern.fullName}</p>
                                  <p className="text-sm text-gray-500">ID: {intern.uniqueId}</p>
                                  {getCommentCount(intern) > 0 && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      {getCommentCount(intern)} comment{getCommentCount(intern) !== 1 ? 's' : ''}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail size={14} />
                                <span>{intern.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone size={14} />
                                <span>{intern.mobile}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {intern.domain}
                              </span>
                              <div className="text-xs text-gray-600">
                                <div className="font-medium">{intern.duration}</div>
                                {intern.extendedDays > 0 && (
                                  <div className="text-green-600 font-semibold mt-1">
                                    +{intern.extendedDays} days extended
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <PerformanceBadge performance={intern.performance} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <AttendanceBadge attendanceRate={stats.attendanceRate} />
                              <div className="text-xs text-gray-500">
                                {stats.attended}/{stats.total} meetings
                              </div>
                              {stats.leaves > 0 && (
                                <div className="text-xs text-orange-600">
                                  {stats.leaves} leave{stats.leaves !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${intern.gender === "Male"
                              ? "bg-blue-100 text-blue-800"
                              : intern.gender === "Female"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-purple-100 text-purple-800"
                              }`}>
                              {intern.gender}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${intern.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}>
                              {intern.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openExtendModal(intern)}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                                title="Extend Internship"
                              >
                                <Plus size={14} />
                                Extend
                              </button>
                              <button
                                onClick={() => openCommentModal(intern)}
                                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                              >
                                <MessageCircle size={14} />
                                {getCommentCount(intern) > 0 ? (
                                  <span>Comments ({getCommentCount(intern)})</span>
                                ) : (
                                  <span>Comment</span>
                                )}
                              </button>
                              <a
                                href={intern.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                              >
                                <FileText className="w-5 h-5" />
                                Resume
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && selectedIntern && (
        <CommentModal
          intern={selectedIntern}
          newComment={newComment}
          setNewComment={setNewComment}
          onClose={() => setShowCommentModal(false)}
          onSubmit={handleAddComment}
          onDeleteComment={handleDeleteComment}
          loading={commentLoading}
        />
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <AttendanceModal
          domains={getInchargeDomains()}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
          interns={getAttendanceInterns()}
          attendanceDate={attendanceDate}
          setAttendanceDate={setAttendanceDate}
          attendanceStatus={attendanceStatus}
          setAttendanceStatus={setAttendanceStatus}
          attendanceRemarks={attendanceRemarks}
          setAttendanceRemarks={setAttendanceRemarks}
          onClose={() => setShowAttendanceModal(false)}
          onSubmit={handleAttendanceSubmit}
          loading={attendanceLoading}
        />
      )}

      {/* Extend Internship Modal */}
      {showExtendModal && selectedInternForExtension && (
        <ExtendInternshipModal
          intern={selectedInternForExtension}
          onClose={() => {
            setShowExtendModal(false);
            setSelectedInternForExtension(null);
          }}
          onExtend={handleExtendInternship}
          loading={extendLoading}
        />
      )}

      {/* Meetings Modal */}
      {showMeetingsModal && (
        <MeetingsModal
          departmentMeetings={departmentMeetings}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedMeetingDate={selectedMeetingDate}
          setSelectedMeetingDate={setSelectedMeetingDate}
          meetingAttendanceData={meetingAttendanceData}
          loading={meetingsLoading}
          onClose={() => setShowMeetingsModal(false)}
          onFetchMeetingDetails={fetchMeetingDetails}
        />
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Extend Internship Modal Component
const ExtendInternshipModal = ({
  intern,
  onClose,
  onExtend,
  loading
}) => {
  const [extendedDays, setExtendedDays] = useState('');

  const handleSubmit = () => {
    if (!extendedDays || extendedDays <= 0) {
      alert('Please enter a valid number of days');
      return;
    }
    onExtend(intern._id, parseInt(extendedDays));
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Extend Internship</h3>
            <p className="text-sm text-gray-600 mt-1">{intern.fullName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Days
            </label>
            <input
              type="number"
              min="1"
              value={extendedDays}
              onChange={(e) => setExtendedDays(e.target.value)}
              placeholder="Enter number of days to extend"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {intern.extendedDays > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Already extended by: <strong>{intern.extendedDays} days</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                New total: <strong>{intern.extendedDays + parseInt(extendedDays || 0)} days</strong>
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!extendedDays || loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Extending...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Extend Internship
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Meetings Modal Component
const MeetingsModal = ({
  departmentMeetings,
  selectedDepartment,
  setSelectedDepartment,
  selectedMeetingDate,
  setSelectedMeetingDate,
  meetingAttendanceData,
  loading,
  onClose,
  onFetchMeetingDetails
}) => {
  const departments = Object.keys(departmentMeetings);
  const currentDepartmentMeetings = departmentMeetings[selectedDepartment] || [];

  const handleDepartmentChange = (dept) => {
    setSelectedDepartment(dept);
    if (departmentMeetings[dept] && departmentMeetings[dept].length > 0) {
      const firstDate = departmentMeetings[dept][0].date;
      setSelectedMeetingDate(firstDate);
      onFetchMeetingDetails(dept, firstDate);
    }
  };

  const handleDateChange = (date) => {
    setSelectedMeetingDate(date);
    onFetchMeetingDetails(selectedDepartment, date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-800";
      case "Absent": return "bg-red-100 text-red-800";
      case "Leave": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAttendanceRateColor = (rate) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-blue-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Department Meetings</h3>
            <p className="text-sm text-gray-600 mt-1">
              View meetings by department and date
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-8rem)]">
          {/* Left Sidebar - Departments and Dates */}
          <div className="w-1/3 border-r p-6 overflow-y-auto">
            <h4 className="font-semibold text-gray-900 mb-4">Departments & Meeting Dates</h4>

            {departments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No meeting data available
              </div>
            ) : (
              <div className="space-y-6">
                {departments.map(dept => (
                  <div key={dept} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleDepartmentChange(dept)}
                      className={`w-full p-4 text-left font-semibold transition-colors ${selectedDepartment === dept
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{dept}</span>
                        <span className="text-sm font-normal bg-white px-2 py-1 rounded-full">
                          {departmentMeetings[dept].length} meetings
                        </span>
                      </div>
                    </button>

                    {selectedDepartment === dept && (
                      <div className="border-t">
                        {currentDepartmentMeetings.map(meeting => (
                          <button
                            key={meeting.date}
                            onClick={() => handleDateChange(meeting.date)}
                            className={`w-full p-3 text-left border-b last:border-b-0 transition-colors ${selectedMeetingDate === meeting.date
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                              : 'hover:bg-gray-50'
                              }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {new Date(meeting.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle size={12} className="text-green-500" />
                                    {meeting.presentCount}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <XCircle size={12} className="text-red-500" />
                                    {meeting.absentCount}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} className="text-yellow-500" />
                                    {meeting.leaveCount}
                                  </span>
                                </div>
                              </div>
                              <span className={`text-xs font-semibold ${getAttendanceRateColor(meeting.attendanceRate)}`}>
                                {Math.round(meeting.attendanceRate)}%
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Content - Attendance Details */}
          <div className="w-2/3 p-6 overflow-y-auto">
            <h4 className="font-semibold text-gray-900 mb-4">
              Attendance Details
              {selectedDepartment && selectedMeetingDate && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - {selectedDepartment} on {new Date(selectedMeetingDate).toLocaleDateString()}
                </span>
              )}
            </h4>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading attendance data...</p>
              </div>
            ) : meetingAttendanceData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p>No attendance records found for selected criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Intern</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {meetingAttendanceData.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">{record.internName}</p>
                            <p className="text-sm text-gray-500">{record.internId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.email}</div>
                          <div className="text-sm text-gray-500">{record.mobile}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.gender === "Male" ? "bg-blue-100 text-blue-800" :
                            record.gender === "Female" ? "bg-pink-100 text-pink-800" :
                              "bg-purple-100 text-purple-800"
                            }`}>
                            {record.gender}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.attendanceStatus)}`}>
                            {record.attendanceStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">{record.remarks || '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Total Records: <strong>{meetingAttendanceData.length}</strong> interns
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Comment Modal Component
const CommentModal = ({
  intern,
  newComment,
  setNewComment,
  onClose,
  onSubmit,
  onDeleteComment,
  loading
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-blur-lg bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Intern Comments</h3>
            <p className="text-sm text-gray-600 mt-1">{intern.fullName} - {intern.domain}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(90vh-8rem)]">
          {/* Add Comment Section */}
          <div className="md:w-1/3 border-r p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Add New Comment</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Comment
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your feedback about this intern..."
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                onClick={() => onSubmit(intern._id)}
                disabled={!newComment.trim() || loading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Comment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="md:w-2/3 p-6 overflow-y-auto">
            <h4 className="font-semibold text-gray-900 mb-4">
              Previous Comments ({intern.comments ? intern.comments.length : 0})
            </h4>

            {!intern.comments || intern.comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No comments yet for this intern.</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to add a comment!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {intern.comments.map((comment) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    internId={intern._id}
                    onDelete={onDeleteComment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Attendance Modal Component
const AttendanceModal = ({
  domains,
  selectedDomain,
  setSelectedDomain,
  interns,
  attendanceDate,
  setAttendanceDate,
  attendanceStatus,
  setAttendanceStatus,
  attendanceRemarks,
  setAttendanceRemarks,
  onClose,
  onSubmit,
  loading
}) => {
  const handleStatusChange = (internId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [internId]: status
    }));
  };

  const handleRemarksChange = (internId, remarks) => {
    setAttendanceRemarks(prev => ({
      ...prev,
      [internId]: remarks
    }));
  };

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);

    // Reset attendance status and remarks when domain changes
    const initialStatus = {};
    const initialRemarks = {};

    // Filter interns for the NEW domain
    const activeInternsInNewDomain = interns.filter(intern =>
      intern.domain === domain && intern.status === "Active"
    );

    // Initialize all interns in the new domain with "Absent" status
    activeInternsInNewDomain.forEach(intern => {
      initialStatus[intern._id] = "Absent"; // Default to Absent
      initialRemarks[intern._id] = ""; // Clear remarks
    });

    setAttendanceStatus(initialStatus);
    setAttendanceRemarks(initialRemarks);
  };

  // Get interns for the currently selected domain
  const getCurrentDomainInterns = () => {
    if (!selectedDomain) return [];
    return interns.filter(intern =>
      intern.domain === selectedDomain && intern.status === "Active"
    );
  };

  const currentDomainInterns = getCurrentDomainInterns();

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mark Attendance by Domain</h3>
            <p className="text-sm text-gray-600 mt-1">
              Mark attendance for active interns on {new Date(attendanceDate).toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Domain and Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Domain
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedDomain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                >
                  <option value="">Select Domain</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Domain Info */}
          {selectedDomain && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Marking attendance for <strong>{selectedDomain}</strong> domain.
                Showing <strong>{currentDomainInterns.length}</strong> active interns.
              </p>
            </div>
          )}

          {/* Attendance Table */}
          {selectedDomain ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intern
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Domain
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDomainInterns.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        No active interns found in {selectedDomain} domain.
                      </td>
                    </tr>
                  ) : (
                    currentDomainInterns.map((intern) => (
                      <tr key={intern._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{intern.fullName}</p>
                              <p className="text-sm text-gray-500">{intern.uniqueId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {intern.domain}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {["Present", "Absent", "Leave"].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(intern._id, status)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${attendanceStatus[intern._id] === status
                                  ? status === "Present"
                                    ? "bg-green-600 text-white"
                                    : status === "Absent"
                                      ? "bg-red-600 text-white"
                                      : "bg-yellow-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Current: {attendanceStatus[intern._id] || "Absent"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            placeholder="Remarks (optional)"
                            value={attendanceRemarks[intern._id] || ""}
                            onChange={(e) => handleRemarksChange(intern._id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Please select a domain to mark attendance.</p>
            </div>
          )}

          {/* Submit Button */}
          {selectedDomain && currentDomainInterns.length > 0 && (
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={loading || !selectedDomain || currentDomainInterns.length === 0}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Marking Attendance & Sending Emails...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Mark Attendance & Send Emails
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Comment Card Component
const CommentCard = ({ comment, internId, onDelete }) => {
  const canDelete = true;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            IC
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">
              Intern Incharge
            </h4>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              {new Date(comment.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canDelete && (
            <button
              onClick={() => onDelete(internId, comment._id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Delete comment"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 text-sm">{comment.text}</p>
    </div>
  );
};

export default InternInchargeDashboard;