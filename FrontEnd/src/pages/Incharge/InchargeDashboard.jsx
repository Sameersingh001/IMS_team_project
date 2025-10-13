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
  FileText
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

      // Update the intern's comments in the local state
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
      // Update the intern's comments in the local state
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

  const openCommentModal = (intern) => {
    setSelectedIntern(intern);
    setNewComment("");
    setShowCommentModal(true);
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
    <div className="min-h-screen bg-gray-50 flex">

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
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
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interns</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{interns.length}</p>
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
                  {interns.filter(intern => intern.status === "Active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <User className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Domains</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{domains.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Departments</p>
                <div className="mt-1">
                  {user?.department?.map((dept, index) => (
                    <p key={index} className="text-xs  font-bold text-gray-800 truncate">
                      {dept}
                    </p>
                  ))}
                </div>              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-6 mb-6">
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
            </div>
          </div>
        </div>

        {/* Interns Table */}
        <div className="px-6 pb-6 flex-1">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
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
                      Domain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
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
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        {interns.length === 0 ? "No interns assigned to you yet." : "No interns match your search criteria."}
                      </td>
                    </tr>
                  ) : (
                    filteredInterns.map((intern) => (
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
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {intern.domain}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PerformanceBadge performance={intern.performance} />
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
                    ))
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
              {/* Comment */}
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

// Comment Card Component
const CommentCard = ({ comment, internId, onDelete }) => {
  const canDelete = true; // You can add logic to check if current user can delete

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