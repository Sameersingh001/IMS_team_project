import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Plus,
  Download,
  Eye
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
        const departments = Object.keys(response.data.departmentMeetings);
        if (departments.length > 0 && !selectedDepartment) {
          setSelectedDepartment(departments[0]);
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

    const initialStatus = {};
    const initialRemarks = {};

    const activeInterns = getActiveInternsByDomain(user?.department?.[0] || "");
    activeInterns.forEach(intern => {
      initialStatus[intern._id] = "Absent";
      initialRemarks[intern._id] = "";
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

  const getActiveInternsByDomain = (domain) => {
    return interns.filter(intern =>
      intern.status === "Active" &&
      intern.domain === domain
    );
  };

  const getInchargeDomains = () => {
    return user?.department || [];
  };

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

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.uniqueId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain = !filterDomain || intern.domain === filterDomain;

    return matchesSearch && matchesDomain;
  });

  const domains = [...new Set(interns.map(intern => intern.domain).filter(domain => domain))];

  const PerformanceBadge = ({ performance }) => {
    const getPerformanceColor = (perf) => {
      switch (perf?.toLowerCase()) {
        case "excellent": return "bg-green-100 text-green-800 border border-green-200";
        case "good": return "bg-blue-100 text-blue-800 border border-blue-200";
        case "average": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
        case "poor": return "bg-red-100 text-red-800 border border-red-200";
        default: return "bg-gray-100 text-gray-800 border border-gray-200";
      }
    };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getPerformanceColor(performance)}`}>
        {performance || "Not Rated"}
      </span>
    );
  };

  const getFilteredStats = () => {
    const filteredInternsData = filteredInterns;

    const totalInterns = filteredInternsData.length;
    const activeInterns = filteredInternsData.filter(intern => intern.status === "Active").length;

    const totalAttendanceRate = filteredInternsData.reduce((acc, intern) =>
      acc + getAttendanceStats(intern).attendanceRate, 0
    );
    const avgAttendance = totalInterns > 0 ? Math.round(totalAttendanceRate / totalInterns) : 0;

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
    let colorClass = "bg-gray-100 text-gray-800 border border-gray-200";
    if (attendanceRate >= 90) colorClass = "bg-green-100 text-green-800 border border-green-200";
    else if (attendanceRate >= 75) colorClass = "bg-blue-100 text-blue-800 border border-blue-200";
    else if (attendanceRate >= 60) colorClass = "bg-yellow-100 text-yellow-800 border border-yellow-200";
    else if (attendanceRate > 0) colorClass = "bg-red-100 text-red-800 border border-red-200";

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colorClass}`}>
        {attendanceRate}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}  
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Intern Incharge Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.fullName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                👋 {user?.fullName}
              </span>
              <button
                onClick={openAttendanceModal}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <CheckCircle size={20} />
                <span className="font-semibold">Mark Attendance</span>
              </button>
              <button
                onClick={() => {
                  setShowMeetingsModal(true);
                  fetchDepartmentMeetings();
                }}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Calendar size={20} />
                <span className="font-semibold">View Meetings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 font-semibold"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Interns</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filterDomain ? getFilteredStats().totalInterns : interns.length}
                </p>
                {filterDomain && (
                  <p className="text-xs text-gray-500 mt-1">Filtered: {filterDomain}</p>
                )}
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Interns</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filterDomain ? getFilteredStats().activeInterns : interns.filter(intern => intern.status === "Active").length}
                </p>
                {filterDomain && (
                  <p className="text-xs text-gray-500 mt-1">In selected domain</p>
                )}
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {filterDomain ? "Selected Domain" : "Domains"}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {filterDomain ? 1 : domains.length}
                </p>
                {filterDomain && (
                  <p className="text-xs text-gray-500 mt-1">{filterDomain}</p>
                )}
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg Attendance</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
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
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {filterDomain ? "Showing Domain" : "Your Domains"}
                </p>
                <div className="mt-2 space-y-1">
                  {filterDomain ? (
                    <p className="text-sm font-bold text-gray-900 truncate">{filterDomain}</p>
                  ) : (
                    user?.department?.slice(0, 2).map((domain, index) => (
                      <p key={index} className="text-sm font-bold text-gray-900 truncate">
                        {domain}
                      </p>
                    ))
                  )}
                  {user?.department?.length > 2 && !filterDomain && (
                    <p className="text-xs text-gray-500">+{user.department.length - 2} more</p>
                  )}
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* Search */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Interns
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Domain Filter */}
              <div className="w-full lg:w-64">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Domain
                </label>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={filterDomain}
                    onChange={(e) => setFilterDomain(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 appearance-none bg-gray-50 focus:bg-white"
                  >
                    <option value="">All Domains</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filter Button */}
              {(filterDomain || searchTerm) && (
                <div className="w-full lg:w-auto">
                  <button
                    onClick={() => {
                      setFilterDomain("");
                      setSearchTerm("");
                    }}
                    className="w-full lg:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Active Filter Indicator */}
            {filterDomain && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Filter size={18} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">
                      Showing data for: <strong>{filterDomain}</strong> domain
                    </span>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full font-semibold">
                    {getFilteredStats().totalInterns} interns
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interns Table */}
        <div className="flex-1 px-6 pb-6 overflow-hidden">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Intern Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Domain & Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterns.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="w-16 h-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg font-semibold">
                            {interns.length === 0 ? "No interns assigned to you yet." : "No interns match your search criteria."}
                          </p>
                          <p className="text-gray-400 text-sm mt-2">
                            {interns.length === 0 ? "Interns will appear here once assigned." : "Try adjusting your search or filter."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInterns.map((intern) => {
                      const stats = getAttendanceStats(intern);
                      return (
                        <tr key={intern._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                <User size={20} className="text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{intern.fullName}</p>
                                <p className="text-xs text-gray-500 mt-1">ID: {intern.uniqueId}</p>
                                {getCommentCount(intern) > 0 && (
                                  <p className="text-xs text-indigo-600 font-medium mt-1 flex items-center gap-1">
                                    <MessageCircle size={12} />
                                    {getCommentCount(intern)} comment{getCommentCount(intern) !== 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm text-gray-700">
                                <Mail size={16} className="text-gray-400" />
                                <span className="font-medium">{intern.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-700">
                                <Phone size={16} className="text-gray-400" />
                                <span className="font-medium">{intern.mobile}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-2">
                              <span className="inline-flex px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">
                                {intern.domain}
                              </span>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="font-semibold">{intern.duration}</div>
                                {intern.extendedDays > 0 && (
                                  <div className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg">
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
                            <div className="space-y-2">
                              <AttendanceBadge attendanceRate={stats.attendanceRate} />
                              <div className="text-xs text-gray-500 space-y-1">
                                <div className="font-medium">
                                  {stats.attended}/{stats.total} meetings
                                </div>
                                {stats.leaves > 0 && (
                                  <div className="text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-lg">
                                    {stats.leaves} leave{stats.leaves !== 1 ? 's' : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-2">
                              <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${intern.status === "Active"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                                }`}>
                                {intern.status}
                              </span>
                              <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${intern.gender === "Male"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : intern.gender === "Female"
                                  ? "bg-pink-100 text-pink-800 border border-pink-200"
                                  : "bg-purple-100 text-purple-800 border border-purple-200"
                                }`}>
                                {intern.gender}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openExtendModal(intern)}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
                                title="Extend Internship"
                              >
                                <Plus size={16} />
                                Extend
                              </button>
                              <button
                                onClick={() => openCommentModal(intern)}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md"
                              >
                                <MessageCircle size={16} />
                                {getCommentCount(intern) > 0 ? (
                                  <span>Comments ({getCommentCount(intern)})</span>
                                ) : (
                                  <span>Comment</span>
                                )}
                              </button>
                              {intern.resumeUrl && (
                                <a
                                  href={intern.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all duration-200"
                                  title="View Resume"
                                >
                                  <Eye size={16} />
                                  Resume
                                </a>
                              )}
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

      {/* Modals */}
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
          className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-40 lg:hidden"
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
    <div className="fixed inset-0 backdrop-blur-sm backdrop-blur-md bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Extend Internship</h3>
            <p className="text-sm text-gray-600 mt-1">{intern.fullName} - {intern.domain}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Additional Days
            </label>
            <input
              type="number"
              min="1"
              value={extendedDays}
              onChange={(e) => setExtendedDays(e.target.value)}
              placeholder="Enter number of days to extend"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          {intern.extendedDays > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700 font-semibold">
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
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!extendedDays || loading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Extending...
                </>
              ) : (
                <>
                  <Plus size={18} />
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
      case "Present": return "bg-green-100 text-green-800 border border-green-200";
      case "Absent": return "bg-red-100 text-red-800 border border-red-200";
      case "Leave": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getAttendanceRateColor = (rate) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-blue-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-blur-md bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">All Department Meetings</h3>
            <p className="text-sm text-gray-600 mt-1">
              View meetings by department and date
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-8rem)]">
          {/* Left Sidebar - Departments and Dates */}
          <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Departments & Meeting Dates</h4>

            {departments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                No meeting data available
              </div>
            ) : (
              <div className="space-y-4">
                {departments.map(dept => (
                  <div key={dept} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => handleDepartmentChange(dept)}
                      className={`w-full p-4 text-left font-semibold transition-all duration-200 ${selectedDepartment === dept
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{dept}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${selectedDepartment === dept
                          ? 'bg-white text-indigo-600'
                          : 'bg-gray-100 text-gray-600'
                          }`}>
                          {departmentMeetings[dept].length} meetings
                        </span>
                      </div>
                    </button>

                    {selectedDepartment === dept && (
                      <div className="border-t border-gray-200">
                        {currentDepartmentMeetings.map(meeting => (
                          <button
                            key={meeting.date}
                            onClick={() => handleDateChange(meeting.date)}
                            className={`w-full p-4 text-left border-b border-gray-100 last:border-b-0 transition-all duration-200 ${selectedMeetingDate === meeting.date
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                              : 'hover:bg-gray-50'
                              }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-sm">
                                  {new Date(meeting.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
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
                              <span className={`text-xs font-bold ${getAttendanceRateColor(meeting.attendanceRate)}`}>
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
            <h4 className="font-bold text-gray-900 mb-4 text-lg">
              Attendance Details
              {selectedDepartment && selectedMeetingDate && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - {selectedDepartment} on {new Date(selectedMeetingDate).toLocaleDateString()}
                </span>
              )}
            </h4>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-semibold">Loading attendance data...</p>
              </div>
            ) : meetingAttendanceData.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-semibold">No attendance records found</p>
                <p className="text-sm text-gray-400 mt-2">Select a different department or date</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Intern</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {meetingAttendanceData.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{record.internName}</p>
                            <p className="text-xs text-gray-500">{record.internId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{record.email}</div>
                          <div className="text-xs text-gray-500">{record.mobile}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${record.gender === "Male" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                            record.gender === "Female" ? "bg-pink-100 text-pink-800 border border-pink-200" :
                              "bg-purple-100 text-purple-800 border border-purple-200"
                            }`}>
                            {record.gender}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(record.attendanceStatus)}`}>
                            {record.attendanceStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600 font-medium">{record.remarks || '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-700 font-semibold">
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
    <div className="fixed inset-0 backdrop-blur-sm backdrop-blur-md bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Intern Comments</h3>
            <p className="text-sm text-gray-600 mt-1">{intern.fullName} - {intern.domain}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(90vh-8rem)]">
          {/* Add Comment Section */}
          <div className="lg:w-1/3 border-r border-gray-200 p-6 bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Add New Comment</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Comment
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your feedback about this intern..."
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-200 bg-white"
                />
              </div>

              <button
                onClick={() => onSubmit(intern._id)}
                disabled={!newComment.trim() || loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Comment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="lg:w-2/3 p-6 overflow-y-auto">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">
              Previous Comments ({intern.comments ? intern.comments.length : 0})
            </h4>

            {!intern.comments || intern.comments.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-semibold">No comments yet for this intern.</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to add a comment!</p>
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

    const initialStatus = {};
    const initialRemarks = {};

    const activeInternsInNewDomain = interns.filter(intern =>
      intern.domain === domain && intern.status === "Active"
    );

    activeInternsInNewDomain.forEach(intern => {
      initialStatus[intern._id] = "Absent";
      initialRemarks[intern._id] = "";
    });

    setAttendanceStatus(initialStatus);
    setAttendanceRemarks(initialRemarks);
  };

  const getCurrentDomainInterns = () => {
    if (!selectedDomain) return [];
    return interns.filter(intern =>
      intern.domain === selectedDomain && intern.status === "Active"
    );
  };

  const currentDomainInterns = getCurrentDomainInterns();

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Mark Attendance by Domain</h3>
            <p className="text-sm text-gray-600 mt-1">
              Mark attendance for active interns on {new Date(attendanceDate).toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Domain and Date Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Domain
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedDomain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 appearance-none bg-gray-50 focus:bg-white"
                >
                  <option value="">Select Domain</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Meeting Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  disabled
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Domain Info */}
          {selectedDomain && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700 font-semibold">
                Marking attendance for <strong>{selectedDomain}</strong> domain.
                Showing <strong>{currentDomainInterns.length}</strong> active interns.
              </p>
            </div>
          )}

          {/* Attendance Table */}
          {selectedDomain ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Intern
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Domain
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDomainInterns.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <User className="w-16 h-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg font-semibold">
                            No active interns found in {selectedDomain} domain.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentDomainInterns.map((intern) => (
                      <tr key={intern._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                              <User size={18} className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{intern.fullName}</p>
                              <p className="text-xs text-gray-500">{intern.uniqueId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">
                            {intern.domain}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {["Present", "Absent", "Leave"].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(intern._id, status)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${attendanceStatus[intern._id] === status
                                  ? status === "Present"
                                    ? "bg-green-600 text-white shadow-md"
                                    : status === "Absent"
                                      ? "bg-red-600 text-white shadow-md"
                                      : "bg-yellow-600 text-white shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 mt-2 font-medium">
                            Current: {attendanceStatus[intern._id] || "Absent"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            placeholder="Remarks (optional)"
                            value={attendanceRemarks[intern._id] || ""}
                            onChange={(e) => handleRemarksChange(intern._id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all duration-200"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Building className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold">Please select a domain to mark attendance.</p>
            </div>
          )}

          {/* Submit Button */}
          {selectedDomain && currentDomainInterns.length > 0 && (
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={loading || !selectedDomain || currentDomainInterns.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Marking Attendance & Sending Emails...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
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
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
            IC
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">
              Intern Incharge
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
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
              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-lg hover:bg-red-50"
              title="Delete comment"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
    </div>
  );
};

export default InternInchargeDashboard;