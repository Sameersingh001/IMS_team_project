import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import graphura from '../../../public/Graphura.jpg';

const InternVerificationPortal = () => {
  const [formData, setFormData] = useState({
    uniqueId: '',
    joiningDate: '',
    email: '',
    captcha: ''
  });
  const [internData, setInternData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const canvasRef = useRef(null);

  // Check if mobile on component mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate CAPTCHA
  const generateCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate random text
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setCaptchaText(text);

    // Adjust font size for mobile
    const fontSize = isMobile ? 24 : 30;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = '#333';
    ctx.fillText(text, 10, isMobile ? 25 : 30);

    // Add some noise
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.captcha !== captchaText) {
      setError('Invalid CAPTCHA code');
      setLoading(false);
      generateCaptcha();
      return;
    }

    try {
      const response = await axios.post('/api/intern/verify', formData);
      setInternData(response.data.responseData);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Format date to numeric format
  const formatDateToNumeric = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch (err) {
      return 'Invalid Date' + err;
    }
  };

  // Get overall performance rating
  const getOverallPerformance = (performance) => {
    if (!performance || !performance.monthlyPerformance) return 'Not Rated';

    const validMonths = performance.monthlyPerformance.filter(month => month.overallRating > 0);
    if (validMonths.length === 0) return 'Not Rated';

    const avgRating = validMonths.reduce((sum, month) => sum + month.overallRating, 0) / validMonths.length;

    if (avgRating >= 8.5) return 'Excellent';
    if (avgRating >= 7) return 'Good';
    if (avgRating >= 5) return 'Average';
    return 'Poor';
  };

  // Print report function
  const printReport = () => {
    const printWindow = window.open('', '_blank');

    // Get monthly performance data safely
    const monthlyPerformance = internData?.performance?.monthlyPerformance || [];
    const overallPerformance = getOverallPerformance(internData?.performance);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title> Graphura Intern Report - ${internData?.fullName || 'Unknown'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #333; 
              padding-bottom: 20px; 
              margin-bottom: 30px;
            }
            .header h1 { 
              color: #2563eb; 
              margin: 0; 
              font-size: 28px;
            }
            .header p { 
              color: #666; 
              margin: 5px 0; 
              font-size: 14px;
            }
            .section { 
              margin-bottom: 30px; 
            }
            .section h2 { 
              color: #2563eb; 
              border-bottom: 1px solid #ddd; 
              padding-bottom: 5px; 
              margin-bottom: 15px;
              font-size: 20px;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 15px; 
            }
            .info-item { 
              margin-bottom: 10px; 
            }
            .info-label { 
              font-weight: bold; 
              color: #555; 
              font-size: 14px;
              margin-bottom: 2px;
            }
            .info-value { 
              color: #333; 
              font-size: 15px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 10px; 
              text-align: left; 
              font-size: 13px;
            }
            th { 
              background-color: #f8fafc; 
              font-weight: bold; 
              color: #374151;
            }
            .stats-grid { 
              display: grid; 
              grid-template-columns: repeat(3, 1fr); 
              gap: 15px; 
              margin: 20px 0;
            }
            .stat-card { 
              background: #f8fafc; 
              padding: 15px; 
              border-radius: 8px; 
              text-align: center;
              border: 1px solid #e2e8f0;
            }
            .stat-value { 
              font-size: 24px; 
              font-weight: bold; 
              color: #2563eb; 
              margin: 5px 0;
            }
            .stat-label { 
              color: #64748b; 
              font-size: 13px;
            }
            .rating-badge {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: bold;
            }
            .rating-excellent { background: #dcfce7; color: #166534; }
            .rating-good { background: #dbeafe; color: #1e40af; }
            .rating-average { background: #fef3c7; color: #92400e; }
            .rating-poor { background: #fee2e2; color: #991b1b; }
            .footer { 
              text-align: center; 
              margin-top: 40px; 
              color: #666; 
              font-size: 12px; 
              border-top: 1px solid #ddd; 
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            @media (max-width: 768px) {
              .info-grid { grid-template-columns: 1fr; }
              .stats-grid { grid-template-columns: 1fr; }
              table { font-size: 11px; }
              th, td { padding: 6px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Graphura India Private Limited</h1>
            <h3>Intern Verification Report</h3>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>

          ${internData ? `
            <div class="section">
              <h2>Intern Details</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Full Name</div>
                  <div class="info-value">${internData.fullName || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${internData.email || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Mobile</div>
                  <div class="info-value">${internData.mobile || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Date of Birth</div>
                  <div class="info-value">${formatDateToNumeric(internData.dob)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Joining Date</div>
                  <div class="info-value">${formatDateToNumeric(internData.joiningDate)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Unique ID</div>
                  <div class="info-value">${internData.uniqueId || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>Internship Details</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Domain</div>
                  <div class="info-value">${internData.domain || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Duration</div>
                  <div class="info-value">${internData.duration || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Status</div>
                  <div class="info-value">${internData.status || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Performance Rating</div>
                  <div class="info-value">${overallPerformance}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>Meeting Statistics</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-label">Total Meetings</div>
                  <div class="stat-value">${internData.totalMeetings || 0}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">Meetings Attended</div>
                  <div class="stat-value">${internData.meetingsAttended || 0}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">Attendance Rate</div>
                  <div class="stat-value">
                    ${internData.totalMeetings > 0
          ? Math.round((internData.meetingsAttended / internData.totalMeetings) * 100)
          : 0}%
                  </div>
                </div>
              </div>
            </div>

            ${monthlyPerformance.length > 0 ? `
              <div class="section">
                <h2>Monthly Performance</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Tasks Completed</th>
                      <th>Completion %</th>
                      <th>Initiative</th>
                      <th>Communication</th>
                      <th>Behavior</th>
                      <th>Overall Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${monthlyPerformance.map((month) => `
                      <tr>
                        <td>${month.monthLabel || 'N/A'}</td>
                        <td>${month.tasksCompleted || 0} / ${month.totalTasks || 0}</td>
                        <td>
                          <span class="rating-badge ${month.completionPercentage >= 80 ? 'rating-excellent' :
              month.completionPercentage >= 60 ? 'rating-good' :
                month.completionPercentage >= 40 ? 'rating-average' : 'rating-poor'
            }">
                            ${month.completionPercentage || 0}%
                          </span>
                        </td>
                        <td>${month.ratings?.initiative || 0}/10</td>
                        <td>${month.ratings?.communication || 0}/10</td>
                        <td>${month.ratings?.behaviour || 0}/10</td>
                        <td>
                          <span class="rating-badge ${month.overallRating >= 8 ? 'rating-excellent' :
              month.overallRating >= 6 ? 'rating-good' :
                month.overallRating >= 4 ? 'rating-average' : 'rating-poor'
            }">
                            ${month.overallRating || 0}/10
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            ${internData.certificateStatus === 'issued' ? `
              <div class="section">
                <h2>Certificate Information</h2>
                <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border: 1px solid #bae6fd;">
                  <strong>Certificate Number:</strong> ${internData.certificateNumber || 'N/A'}<br>
                  <strong>Issued Date:</strong> ${formatDateToNumeric(internData.certificateIssuedAt)}<br>
                  <strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Verified & Issued</span>
                </div>
              </div>
            ` : ''}
          ` : '<p>No data available</p>'}

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Graphura India Private Limited</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Initialize CAPTCHA on component mount and when mobile state changes
  useEffect(() => {
    generateCaptcha();
  }, [isMobile]);

  // Safely get monthly performance data
  const monthlyPerformance = internData?.performance?.monthlyPerformance || [];
  const overallPerformance = getOverallPerformance(internData?.performance);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 mb-4 md:mb-6 relative overflow-hidden">

            {/* 🔹 Background Branding Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-blue-50 to-white opacity-80"></div>

            {/* 🔹 Branding Logo & Title */}
            <div className="relative z-10">
              <div className="flex flex-col items-center mb-4 md:mb-6">
                <img
                  src={graphura}
                  alt="Graphura Logo"
                  className="w-12 h-12 md:w-20 md:h-20 mb-2 md:mb-3 rounded-full shadow-md border border-gray-200"
                />
                <h1 className="text-xl md:text-4xl font-extrabold text-indigo-800 tracking-tight">
                  Graphura India Pvt. Ltd.
                </h1>
                <p className="text-gray-600 italic text-xs md:text-base mt-1">Empowering Interns, Empowering Future</p>
              </div>

              {/* 🔹 Portal Heading */}
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                Intern Verification Portal
              </h2>
              <p className="text-gray-600 text-sm md:text-lg">
                Verify your internship details and performance records with ease
              </p>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        {!internData && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-8 mb-6 md:mb-8">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Unique ID *
                  </label>
                  <input
                    type="text"
                    name="uniqueId"
                    value={formData.uniqueId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="Enter your unique ID"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="Enter your registered email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    CAPTCHA Verification *
                  </label>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <canvas
                      ref={canvasRef}
                      width={isMobile ? "120" : "150"}
                      height={isMobile ? "40" : "50"}
                      className="border-2 border-gray-300 rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs md:text-sm transition-colors duration-200 whitespace-nowrap"
                    >
                      🔄 Refresh
                    </button>
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="Enter CAPTCHA code shown above"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl flex items-center text-sm">
                  <span className="text-base mr-2">⚠️</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base md:text-lg shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2 md:mr-3"></div>
                    Verifying Details...
                  </span>
                ) : (
                  'Verify Intern Details'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Intern Details Display */}
        {internData && (
          <div className="space-y-4 md:space-y-6">
            {/* Intern Details Card */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4 md:mb-6">
                <h2 className="text-xl md:text-3xl font-bold text-gray-900">Intern Details</h2>
                <button
                  onClick={printReport}
                  className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <span>🖨️</span>
                  <span>Print Report</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-200">
                  <label className="text-xs md:text-sm font-medium text-blue-700">Full Name</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1 break-words">{internData.fullName}</p>
                </div>
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-200">
                  <label className="text-xs md:text-sm font-medium text-blue-700">Email</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1 break-words">{internData.email}</p>
                </div>
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-200">
                  <label className="text-xs md:text-sm font-medium text-blue-700">Mobile</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{internData.mobile}</p>
                </div>
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-200">
                  <label className="text-xs md:text-sm font-medium text-blue-700">Date of Birth</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{formatDateToNumeric(internData.dob)}</p>
                </div>
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-200">
                  <label className="text-xs md:text-sm font-medium text-blue-700">Joining Date</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{formatDateToNumeric(internData.joiningDate)}</p>
                </div>
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-200">
                  <label className="text-xs md:text-sm font-medium text-blue-700">Unique ID</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1 break-words">{internData.uniqueId}</p>
                </div>
              </div>
            </div>

            {/* Internship Details Card */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-8">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Internship Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-green-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-green-200">
                  <label className="text-xs md:text-sm font-medium text-green-700">Domain</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{internData.domain}</p>
                </div>
                <div className="bg-green-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-green-200">
                  <label className="text-xs md:text-sm font-medium text-green-700">Duration</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{internData.duration}</p>
                </div>
                <div className="bg-green-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-green-200">
                  <label className="text-xs md:text-sm font-medium text-green-700">Status</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{internData.status}</p>
                </div>
                <div className="bg-green-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-green-200">
                  <label className="text-xs md:text-sm font-medium text-green-700">Performance</label>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{overallPerformance}</p>
                </div>
              </div>
            </div>

            {/* Meeting Statistics Card */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-8">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Meeting Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
                <div className="text-center p-4 md:p-6 bg-blue-50 rounded-lg md:rounded-xl border border-blue-200">
                  <p className="text-xs md:text-sm font-medium text-blue-700">Total Meetings</p>
                  <p className="text-2xl md:text-4xl font-bold text-blue-600 mt-1 md:mt-2">{internData.totalMeetings || 0}</p>
                </div>
                <div className="text-center p-4 md:p-6 bg-green-50 rounded-lg md:rounded-xl border border-green-200">
                  <p className="text-xs md:text-sm font-medium text-green-700">Meetings Attended</p>
                  <p className="text-2xl md:text-4xl font-bold text-green-600 mt-1 md:mt-2">{internData.meetingsAttended || 0}</p>
                </div>
                <div className="text-center p-4 md:p-6 bg-purple-50 rounded-lg md:rounded-xl border border-purple-200">
                  <p className="text-xs md:text-sm font-medium text-purple-700">Attendance Rate</p>
                  <p className="text-2xl md:text-4xl font-bold text-purple-600 mt-1 md:mt-2">
                    {internData.totalMeetings > 0
                      ? Math.round((internData.meetingsAttended / internData.totalMeetings) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly Performance Table */}
            {monthlyPerformance.length > 0 && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-8">
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Monthly Performance</h2>
                <div className="overflow-x-auto -mx-2 md:mx-0">
                  <div className="min-w-full inline-block align-middle">
                    <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Month</th>
                          <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tasks</th>
                          <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Completion</th>
                          <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Initiative</th>
                          <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Comm</th>
                          <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Behavior</th>
                          <th className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Overall</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {monthlyPerformance.map((month, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-semibold text-gray-900">
                              {month.monthLabel || 'N/A'}
                            </td>
                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                              {month.tasksCompleted || 0}/{month.totalTasks || 0}
                            </td>
                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${(month.completionPercentage || 0) >= 80 ? 'bg-green-100 text-green-800' :
                                  (month.completionPercentage || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {month.completionPercentage || 0}%
                              </span>
                            </td>
                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                              {month.ratings?.initiative || 0}/10
                            </td>
                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                              {month.ratings?.communication || 0}/10
                            </td>
                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                              {month.ratings?.behaviour || 0}/10
                            </td>
                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${(month.overallRating || 0) >= 8 ? 'bg-green-100 text-green-800' :
                                  (month.overallRating || 0) >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {month.overallRating || 0}/10
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Certificate Information */}
            {internData.certificateStatus === 'issued' && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-8">
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Certificate Information</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg md:rounded-xl p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-1 md:mb-2">✅ Certificate Issued</h3>
                      <p className="text-green-700 text-sm md:text-base">
                        <strong>Certificate Number:</strong> {internData.certificateNumber}
                      </p>
                      <p className="text-green-700 text-sm md:text-base">
                        <strong>Issued Date:</strong> {formatDateToNumeric(internData.certificateIssuedAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold bg-green-100 text-green-800 self-start md:self-auto">
                      Verified & Issued
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternVerificationPortal;