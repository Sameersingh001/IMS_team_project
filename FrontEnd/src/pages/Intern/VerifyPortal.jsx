import { useState, useEffect } from 'react';
import { Search, User, Calendar, Mail, IdCard, Rocket, TrendingUp, Activity, Target, Clock, Award, RefreshCw } from "lucide-react";

const InternDetailsPage = () => {
    const [searchParams, setSearchParams] = useState({
        email: '',
        uniqueId: '',
        joiningDate: ''
    });
    const [internData, setInternData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [userCaptchaInput, setUserCaptchaInput] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);

    // Mock data - replace with actual API call
    const mockInternData = {
        uniqueId: "GRAPHURA/25/10/119",
        fullName: "Sameer Singh",
        email: "sameer.singh@example.com",
        joiningDate: "2025-10-01",  
        endingDate: "2026-01-01",
        certificateGenerated: false,
        certificateNo: "Not Generated",
        department: "Back-end Developer",
        duration: "3 Months",
        status: "Running",
        performance: "Good",
        college: "Tech University",
        course: "Computer Science",

        // Dynamic monthly scores - only show months that have data
        monthlyScores: [
            {
                month: "1st Month",
                score: 85,
                remarks: "Excellent start"
            },
            {
                month: "2nd Month",
                score: 88,
                remarks: "Steady progress"
            },
            {
                month: "3rd Month",
                score: 92,
                remarks: "Outstanding performance"
            }
        ],

        // Soft skills calculated based on monthly performance
        softSkills: {
            initiative: 85,
            communication: 90,
            behaviour: 88
        }
    };

    // Generate 6-digit numeric CAPTCHA
    const generateCaptcha = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setCaptchaCode(code);
        setUserCaptchaInput('');
        setCaptchaVerified(false);
        setError('');
    };

    // Manual verify button
    const handleCaptchaVerify = () => {
        if (userCaptchaInput === captchaCode) {
            setCaptchaVerified(true);
            setError('');
        } else {
            setCaptchaVerified(false);
            setError('❌ CAPTCHA verification failed. Please try again.');
            generateCaptcha();
        }
    };

    // Initialize CAPTCHA on component mount
    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Check if CAPTCHA is verified
        if (!captchaVerified) {
            setError('Please verify CAPTCHA first');
            setLoading(false);
            return;
        }

        // Check if at least one search parameter is provided
        if (!searchParams.email && !searchParams.uniqueId && !searchParams.joiningDate) {
            setError('Please enter at least one search parameter');
            setLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setInternData(mockInternData);
            setLoading(false);
        }, 1000);
    };

    const PerformanceRing = ({ percentage, label, color = "blue" }) => {
        const colors = {
            blue: "text-blue-500",
            green: "text-green-500",
            purple: "text-purple-500",
            orange: "text-orange-500"
        };

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 * (1 - percentage / 100)}
                            className={colors[color]}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{percentage}%</span>
                    </div>
                </div>
                <span className="text-sm mt-2 text-gray-600">{label}</span>
            </div>
        );
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Running': { color: 'green', text: 'Running' },
            'Completed': { color: 'blue', text: 'Completed' },
            'Terminated': { color: 'red', text: 'Terminated' }
        };

        const config = statusConfig[status] || { color: 'gray', text: status };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-bold bg-${config.color}-500/20 text-${config.color}-300 border border-${config.color}-500/50`}>
                {config.text}
            </span>
        );
    };

    const getCertificateBadge = (isGenerated) => {
        return isGenerated ? (
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-300 border border-green-500/50 flex items-center">
                Generated
            </span>
        ) : (
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-orange-500/20 text-orange-300 border border-orange-500/50 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Pending
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-10 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                        Intern Performance Portal
                    </h1>
                    <p className="text-xl text-gray-300">
                        Track and analyze intern performance with cutting-edge analytics
                    </p>
                </div>

                {/* Search Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
                    <div className="flex items-center mb-6">
                        <Search className="w-8 h-8 text-cyan-400 mr-3" />
                        <h2 className="text-2xl font-bold">Find Intern Details</h2>
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-300">
                                <Mail className="w-4 h-4 mr-2" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={searchParams.email}
                                onChange={(e) => setSearchParams({ ...searchParams, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                placeholder="intern@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-300">
                                <IdCard className="w-4 h-4 mr-2" />
                                Unique ID
                            </label>
                            <input
                                type="text"
                                value={searchParams.uniqueId}
                                onChange={(e) => setSearchParams({ ...searchParams, uniqueId: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                placeholder="GRAPHURA/25/10/119"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-300">
                                <Calendar className="w-4 h-4 mr-2" />
                                Joining Date
                            </label>
                            <input
                                type="date"
                                value={searchParams.joiningDate}
                                onChange={(e) => setSearchParams({ ...searchParams, joiningDate: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* CAPTCHA Section */}
                        <div className="md:col-span-3 bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1">
                                    <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Security Verification
                                    </label>
                                    <p className="text-sm text-gray-400 mb-4">
                                        Enter the 6-digit code below to verify you're not a robot
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={userCaptchaInput}
                                                onChange={(e) => setUserCaptchaInput(e.target.value)}
                                                maxLength={6}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-center text-xl font-mono tracking-widest"
                                                placeholder="000000"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={generateCaptcha}
                                            className="px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-xl text-cyan-300 transition-all flex items-center gap-2"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Refresh
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="bg-slate-800 border border-white/20 rounded-xl p-4 min-w-[140px]">
                                        <div className="text-2xl font-mono font-bold text-center text-cyan-300 tracking-widest bg-white/10 py-3 px-4 rounded-lg">
                                            {captchaCode}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 mt-2">6-digit code</span>
                                </div>
                            </div>

                            {/* Verify CAPTCHA Button */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    type="button"
                                    onClick={handleCaptchaVerify}
                                    disabled={!userCaptchaInput || userCaptchaInput.length !== 6}
                                    className="px-5 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-xl text-green-300 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Verify CAPTCHA
                                </button>

                                {captchaVerified && (
                                    <div className="flex items-center text-green-400 font-medium">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                        Verified - You can now search
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <div className="md:col-span-3">
                            <button
                                type="submit"
                                disabled={loading || !captchaVerified}
                                className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Rocket className="w-6 h-6 mr-2" />
                                        {captchaVerified ? 'Launch Search' : 'Verify CAPTCHA to Search'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {internData && (
                    <div className="space-y-8">
                        {/* Intern Basic Info */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                                <div className="flex items-center">
                                    <User className="w-8 h-8 text-cyan-400 mr-3" />
                                    <h2 className="text-2xl font-bold">Intern Information</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {getStatusBadge(internData.status)}
                                    {getCertificateBadge(internData.certificateGenerated)}
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-bold border border-purple-500/50">
                                        {internData.performance}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Unique ID</label>
                                    <div className="flex items-center text-lg font-semibold">
                                        <IdCard className="w-5 h-5 mr-2 text-cyan-400" />
                                        {internData.uniqueId}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Intern Name</label>
                                    <div className="flex items-center text-lg font-semibold">
                                        <User className="w-5 h-5 mr-2 text-cyan-400" />
                                        {internData.fullName}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email</label>
                                    <div className="flex items-center text-lg font-semibold">
                                        <Mail className="w-5 h-5 mr-2 text-cyan-400" />
                                        {internData.email}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Department</label>
                                    <div className="text-lg font-semibold">{internData.department}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Joining Date</label>
                                    <div className="flex items-center text-lg font-semibold">
                                        <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                                        {internData.joiningDate}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Ending Date</label>
                                    <div className="flex items-center text-lg font-semibold">
                                        <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                                        {internData.endingDate}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Duration</label>
                                    <div className="text-lg font-semibold">{internData.duration}</div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Certificate</label>
                                    <div className="flex items-center text-lg font-semibold">
                                        {internData.certificateNo}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Monthly Scores - Dynamic based on available data */}
                            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                                <div className="flex items-center mb-6">
                                    <TrendingUp className="w-8 h-8 text-purple-400 mr-3" />
                                    <h2 className="text-2xl font-bold">Monthly Performance Scores</h2>
                                </div>

                                <div className="space-y-6">
                                    {internData.monthlyScores.map((month, index) => (
                                        <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-bold text-cyan-300">{month.month}</h3>
                                                <div className="text-right">
                                                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                                        {month.score}%
                                                    </div>
                                                    <div className="text-sm text-gray-400">Overall Score</div>
                                                </div>
                                            </div>

                                            {/* Score Visualization */}
                                            <div className="w-full bg-gray-700/50 rounded-full h-4 mb-4">
                                                <div
                                                    className="h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000 ease-out"
                                                    style={{ width: `${month.score}%` }}
                                                ></div>
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                                <span className="text-sm text-gray-400">Remarks</span>
                                                <span className="text-sm text-green-300 font-medium">{month.remarks}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Metrics */}
                            <div className="space-y-8">
                                {/* Soft Skills */}
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                                    <div className="flex items-center mb-6">
                                        <Activity className="w-8 h-8 text-green-400 mr-3" />
                                        <h2 className="text-2xl font-bold">Soft Skills</h2>
                                    </div>

                                    <div className="space-y-6">
                                        {Object.entries(internData.softSkills).map(([skill, score]) => (
                                            <div key={skill} className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-300 capitalize">{skill}</span>
                                                    <span className="text-cyan-300 font-bold">{score}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700/50 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-1000"
                                                        style={{ width: `${score}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                                    <div className="flex items-center mb-6">
                                        <Target className="w-8 h-8 text-orange-400 mr-3" />
                                        <h2 className="text-2xl font-bold">Performance Metrics</h2>
                                    </div>

                                    <div className="flex justify-around mb-6">
                                        <PerformanceRing
                                            percentage={internData.monthlyScores[internData.monthlyScores.length - 1].score}
                                            label="Current"
                                            color="cyan"
                                        />
                                        <PerformanceRing
                                            percentage={internData.softSkills.communication}
                                            label="Communication"
                                            color="green"
                                        />
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-300">Total Months</span>
                                            <span className="text-cyan-300 font-bold">{internData.monthlyScores.length}</span>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-300">Average Score</span>
                                            <span className="text-green-300 font-bold">
                                                {Math.round(internData.monthlyScores.reduce((acc, curr) => acc + curr.score, 0) / internData.monthlyScores.length)}%
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-300">Progress Trend</span>
                                            <div className="flex items-center text-green-400">
                                                <TrendingUp className="w-4 h-4 mr-1" />
                                                <span>+{internData.monthlyScores[internData.monthlyScores.length - 1].score - internData.monthlyScores[0].score}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Certificate Status */}
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                                    <div className="flex items-center mb-6">
                                        <Award className="w-8 h-8 text-yellow-400 mr-3" />
                                        <h2 className="text-2xl font-bold">Certificate</h2>
                                    </div>

                                    <div className="text-center">
                                        {internData.certificateGenerated ? (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                                                </div>
                                                <div>
                                                    <div className="text-green-400 font-bold text-lg">Generated</div>
                                                    <div className="text-sm text-gray-400 mt-1">Certificate No: {internData.certificateNo}</div>
                                                </div>
                                                <button className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 rounded-lg font-semibold transition-all">
                                                    Download Certificate
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-500/50">
                                                    <Clock className="w-8 h-8 text-orange-400" />
                                                </div>
                                                <div>
                                                    <div className="text-orange-400 font-bold text-lg">Pending</div>
                                                    <div className="text-sm text-gray-400 mt-1">Will be generated after completion</div>
                                                </div>
                                                <button className="w-full py-2 px-4 bg-gray-600/50 rounded-lg font-semibold text-gray-400 cursor-not-allowed" disabled>
                                                    Generate Certificate
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternDetailsPage;