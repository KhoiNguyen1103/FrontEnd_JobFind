import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, Button } from "@mui/material";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileAlt,
    faBriefcase,
    faUsers,
    faClipboardCheck,
    faChartLine,
    faHome,
    faBuilding,
    faUser,
    faSignOut,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import adminApi from "../api/adminApi";
import applicationApi from "../api/applicationApi";
import jobApi from "../api/jobApi";
import companyApi from "../api/companyApi";
import jobSeekerApi from "../api/jobSeekerApi";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import JobDetailModal from "./JobDetailModal";
import ApplicationListModal from "./ApplicationListModal.JSX";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth?.user);
    const adminId = user?.id;
    const [selectedJob, setSelectedJob] = useState(null); // Job được chọn để xem chi tiết
    const [openJobModal, setOpenJobModal] = useState(false); // Trạng thái modal job
    const [openApplicationsModal, setOpenApplicationsModal] = useState(false); // Trạng thái modal ứng tuyển
    const [jobApplications, setJobApplications] = useState([]);
    const [approvalFilter, setApprovalFilter] = useState("all");

    // Tab state
    const [activeTab, setActiveTab] = useState("Dashboard");

    // Dashboard states
    const [stats, setStats] = useState({
        totalApplications: 0,
        openJobs: 0,
        activeUsers: 0,
        pendingApprovals: 0,
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [trendChartData, setTrendChartData] = useState({
        labels: [],
        datasets: [{ label: "Đơn ứng tuyển", data: [], backgroundColor: "rgba(59, 130, 246, 0.5)", borderColor: "rgba(59, 130, 246, 1)", borderWidth: 1 }],
    });
    const [regionChartData, setRegionChartData] = useState({
        labels: [],
        datasets: [{ label: "Đơn ứng tuyển", data: [], backgroundColor: "rgba(99, 102, 241, 0.5)", borderColor: "rgba(99, 102, 241, 1)", borderWidth: 1 }],
    });
    const [trendFilter, setTrendFilter] = useState("range");
    const [trendMonth, setTrendMonth] = useState(null);
    const [regionFilter, setRegionFilter] = useState("range");
    const [regionMonth, setRegionMonth] = useState(null);

    // Table states
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [jobSeekers, setJobSeekers] = useState([]);
    const [applicationPage, setApplicationPage] = useState(1);
    const [jobPage, setJobPage] = useState(1);
    const [companyPage, setCompanyPage] = useState(1);
    const [jobSeekerPage, setJobSeekerPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch Dashboard data
    useEffect(() => {
        if (activeTab === "Dashboard") {
            adminApi.getDashboardStats()
                .then((res) => setStats(res))
                .catch((err) => console.error("Lỗi lấy stats:", err));

            adminApi.getRecentApplications()
                .then((res) => setRecentApplications(res))
                .catch((err) => console.error("Lỗi lấy recent applications:", err));

            adminApi.getApplicationTrends(trendFilter, trendMonth)
                .then((res) => {
                    setTrendChartData({
                        labels: res.labels,
                        datasets: [{ ...trendChartData.datasets[0], data: res.counts }],
                    });
                })
                .catch((err) => console.error("Lỗi lấy trends:", err));

            adminApi.getActiveRegions(regionFilter, regionMonth)
                .then((res) => {
                    setRegionChartData({
                        labels: res.labels,
                        datasets: [{ ...regionChartData.datasets[0], data: res.counts }],
                    });
                })
                .catch((err) => console.error("Lỗi lấy regions:", err));
        }
    }, [activeTab, trendFilter, trendMonth, regionFilter, regionMonth]);

    // Fetch Applications
    const fetchApplications = () => {
        applicationApi.getAll()
            .then((res) => setApplications(res))
            .catch((err) => console.error("Lỗi lấy applications:", err));
    };

    // Fetch Jobs
    const fetchJobs = () => {
        jobApi.getAll()
            .then((res) => setJobs(res))
            .catch((err) => console.error("Lỗi lấy jobs:", err));
    };

    // Fetch Companies
    const fetchCompanies = () => {
        companyApi.getAll()
            .then((res) => setCompanies(res))
            .catch((err) => console.error("Lỗi lấy companies:", err));
    };

    // Fetch Job Seekers
    const fetchJobSeekers = () => {
        jobSeekerApi.getAll()
            .then((res) => setJobSeekers(res))
            .catch((err) => console.error("Lỗi lấy job seekers:", err));
    };

    const filteredJobs = jobs.filter((job) => {
        if (approvalFilter === "approved") return job.isApproved;
        if (approvalFilter === "pending") return !job.isApproved;
        return true;
    })

    const handleOpenJobModal = (job) => {
        setSelectedJob(job);
        setOpenJobModal(true);
    };

    // Hàm đóng modal chi tiết job
    const handleCloseJobModal = () => {
        setSelectedJob(null);
        setOpenJobModal(false);
    };

    // Hàm duyệt job
    const handleApproveJob = async (jobId) => {
        try {
            await jobApi.approve(jobId);
            setJobs(jobs.map((job) => job.jobId === jobId ? { ...job, isApproved: true } : job));
            setSelectedJob({ ...selectedJob, isApproved: true });
        } catch (err) {
            console.error("Lỗi duyệt job:", err);
        }
    };

    // Hàm mở modal danh sách ứng tuyển
    const handleOpenApplicationsModal = async (jobId) => {
        try {
            const response = await applicationApi.getApplicationOfJob(jobId);
            setJobApplications(response);
            setOpenApplicationsModal(true);
        } catch (err) {
            console.error("Lỗi lấy applications của job:", err);
        }
    };

    // Hàm đóng modal danh sách ứng tuyển
    const handleCloseApplicationsModal = () => {
        setOpenApplicationsModal(false);
        setJobApplications([]);
    };

    // Fetch table data based on active tab
    useEffect(() => {
        if (activeTab === "Đơn Ứng Tuyển") fetchApplications();
        if (activeTab === "Công Việc") fetchJobs();
        if (activeTab === "Công Ty") fetchCompanies();
        if (activeTab === "Người Tìm Việc") fetchJobSeekers();
    }, [activeTab]);

    // Pagination logic
    const paginate = (data, page) => {
        const start = (page - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg p-4">
                <div className="flex items-center mb-6">
                    <FontAwesomeIcon icon={faChartLine} className="text-blue-500 text-2xl mr-2" />
                    <h1 className="text-xl font-bold">Admin</h1>
                </div>
                <nav>
                    <ul>
                        {["Dashboard", "Đơn Ứng Tuyển", "Công Việc", "Công Ty", "Người Tìm Việc"].map((tab) => (
                            <li key={tab} className="mb-2">
                                <button
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center p-2 w-full text-left rounded ${activeTab === tab ? "text-blue-500 bg-blue-100" : "hover:bg-gray-100"
                                        }`}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            tab === "Dashboard" ? faHome :
                                                tab === "Đơn Ứng Tuyển" ? faFileAlt :
                                                    tab === "Công Việc" ? faBriefcase :
                                                        tab === "Công Ty" ? faBuilding :
                                                            faUser
                                        }
                                        className="mr-2"
                                    />
                                    {tab}
                                </button>
                            </li>
                        ))}
                        <li className="mb-2">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left flex items-center p-2 hover:bg-gray-100 rounded"
                            >
                                <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                                Đăng Xuất
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Chào mừng, Admin!</h2>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faUserCircle} className="text-2xl mr-2" />
                        <span>{user?.fullName || "Admin"}</span>
                    </div>
                </div>

                {/* Content based on active tab */}
                {activeTab === "Dashboard" && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <Card className="dark:bg-gray-800 bg-white hover:shadow-xl transition rounded-2xl p-4">
                                <CardContent className="flex items-center gap-4">
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                        <FontAwesomeIcon icon={faFileAlt} size="lg" />
                                    </div>
                                    <div>
                                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                                            Tổng Đơn Ứng Tuyển
                                        </Typography>
                                        <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
                                            {stats.totalApplications}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="dark:bg-gray-800 bg-white hover:shadow-xl transition rounded-2xl p-4">
                                <CardContent className="flex items-center gap-4">
                                    <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                        <FontAwesomeIcon icon={faBriefcase} size="lg" />
                                    </div>
                                    <div>
                                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                                            Công Việc Đang Mở
                                        </Typography>
                                        <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
                                            {stats.openJobs}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="dark:bg-gray-800 bg-white hover:shadow-xl transition rounded-2xl p-4">
                                <CardContent className="flex items-center gap-4">
                                    <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                        <FontAwesomeIcon icon={faUsers} size="lg" />
                                    </div>
                                    <div>
                                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                                            Người Dùng Hoạt Động
                                        </Typography>
                                        <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
                                            {stats.activeUsers}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="dark:bg-gray-800 bg-white hover:shadow-xl transition rounded-2xl p-4">
                                <CardContent className="flex items-center gap-4">
                                    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                                        <FontAwesomeIcon icon={faClipboardCheck} size="lg" />
                                    </div>
                                    <div>
                                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                                            Công Việc Cần Duyệt
                                        </Typography>
                                        <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
                                            {stats.pendingApprovals}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart: Application Trends */}
                        <Card className="mb-6">
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h6" className="font-bold">Xu Hướng Đơn Ứng Tuyển</Typography>
                                    <div className="flex gap-2">
                                        <Select
                                            value={trendFilter}
                                            onChange={(e) => setTrendFilter(e.target.value)}
                                            className="bg-gray-200"
                                            size="small"
                                        >
                                            <MenuItem value="range">Trong năm</MenuItem>
                                            <MenuItem value="month">Từng Tháng</MenuItem>
                                        </Select>
                                        {trendFilter === "month" && (
                                            <Select
                                                value={trendMonth || ""}
                                                onChange={(e) => setTrendMonth(Number(e.target.value))}
                                                className="bg-gray-200"
                                                size="small"
                                            >
                                                {[...Array(new Date().getMonth() + 1)].map((_, i) => (
                                                    <MenuItem key={i + 1} value={i + 1}>Tháng {i + 1}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </div>
                                </div>
                                <div className="h-64">
                                    <Bar data={trendChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Chart: Top Active Regions */}
                        <Card className="mb-6">
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h6" className="font-bold">Khu Vực Hoạt Động Cao Nhất</Typography>
                                    <div className="flex gap-2">
                                        <Select
                                            value={regionFilter}
                                            onChange={(e) => setRegionFilter(e.target.value)}
                                            className="bg-gray-200"
                                            size="small"
                                        >
                                            <MenuItem value="range">Trong năm</MenuItem>
                                            <MenuItem value="month">Từng Tháng</MenuItem>
                                        </Select>
                                        {regionFilter === "month" && (
                                            <Select
                                                value={regionMonth || ""}
                                                onChange={(e) => setRegionMonth(Number(e.target.value))}
                                                className="bg-gray-200"
                                                size="small"
                                            >
                                                {[...Array(new Date().getMonth() + 1)].map((_, i) => (
                                                    <MenuItem key={i + 1} value={i + 1}>Tháng {i + 1}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </div>
                                </div>
                                <div className="h-64">
                                    <Bar data={regionChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Applications */}
                        <Card>
                            <CardContent>
                                <Typography variant="h6" className="font-bold mb-4">Đơn Ứng Tuyển Gần Đây</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ứng Viên</TableCell>
                                            <TableCell>Vị Trí</TableCell>
                                            <TableCell>Trạng Thái</TableCell>
                                            <TableCell>Ngày</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentApplications.map((app) => (
                                            <TableRow key={app.id}>
                                                <TableCell>{app.applicant}</TableCell>
                                                <TableCell>{app.jobTitle}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-3 py-1 text-sm font-medium rounded-full ${app.status === "HIRED" ? "bg-green-100 text-green-700" :
                                                            app.status === "INTERVIEWING" ? "bg-blue-100 text-blue-700" :
                                                                app.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                                                    "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {app.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{new Intl.DateTimeFormat('vi-VN').format(new Date(app.date))}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                )}

                {activeTab === "Đơn Ứng Tuyển" && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" className="font-bold mb-4">Danh Sách Đơn Ứng Tuyển</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Ứng Viên</TableCell>
                                        <TableCell>Vị Trí</TableCell>
                                        <TableCell>Công ty</TableCell>
                                        <TableCell>Trạng Thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginate(applications, applicationPage).map((app) => (
                                        <TableRow key={app.applicationId}>
                                            <TableCell>{app.applicationId}</TableCell>
                                            <TableCell>{app.jobSeekerProfile.firstName} {app.jobSeekerProfile.lastName}</TableCell>
                                            <TableCell>{app.job.title}</TableCell>
                                            <TableCell>{app.job.company.companyName}</TableCell>
                                            <TableCell>
                                                {(() => {
                                                    const latestStatus = app.statusDTOList?.[app.statusDTOList.length - 1]?.status;
                                                    return (
                                                        <span
                                                            className={`px-3 py-1 text-sm font-medium rounded-full ${latestStatus === "HIRED" ? "bg-green-100 text-green-700" :
                                                                latestStatus === "INTERVIEWING" ? "bg-blue-100 text-blue-700" :
                                                                    latestStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                                                        "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {latestStatus}
                                                        </span>
                                                    );
                                                })()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <Button
                                        onClick={() => setApplicationPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={applicationPage === 1}
                                        variant="outlined"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => setApplicationPage((prev) => prev + 1)}
                                        disabled={applicationPage * itemsPerPage >= applications.length}
                                        variant="outlined"
                                        className="ml-2"
                                    >
                                        Next
                                    </Button>
                                </div>
                                <Button onClick={fetchApplications} variant="contained" color="primary">
                                    Cập nhật
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "Công Việc" && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" className="font-bold mb-4">Danh Sách Công Việc</Typography>
                            <div className="mb-4 flex gap-2 mt-2">
                                <Button
                                    variant={approvalFilter === "all" ? "contained" : "outlined"}
                                    onClick={() => {
                                        setApprovalFilter("all");
                                        setJobPage(1);
                                    }}
                                >
                                    Tất cả
                                </Button>
                                <Button
                                    variant={approvalFilter === "approved" ? "contained" : "outlined"}
                                    onClick={() => {
                                        setApprovalFilter("approved");
                                        setJobPage(1);
                                    }}
                                >
                                    Đã duyệt
                                </Button>
                                <Button
                                    variant={approvalFilter === "pending" ? "contained" : "outlined"}
                                    onClick={() => {
                                        setApprovalFilter("pending");
                                        setJobPage(1);
                                    }}
                                >
                                    Chờ duyệt
                                </Button>
                            </div>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Tiêu Đề</TableCell>
                                        <TableCell>Công Ty</TableCell>
                                        <TableCell>Trạng Thái</TableCell>
                                        <TableCell>Địa Điểm</TableCell>
                                        <TableCell>Ngày Đăng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginate(filteredJobs, jobPage).map((job) => (
                                        <TableRow
                                            key={job.jobId}
                                            onClick={() => handleOpenJobModal(job)}
                                            className="cursor-pointer hover:bg-gray-50"
                                        >
                                            <TableCell>{job.jobId}</TableCell>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.company?.companyName || "N/A"}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-3 py-1 text-sm font-medium rounded-full ${job.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {job.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                                                </span>
                                            </TableCell>
                                            <TableCell>{job.location}</TableCell>
                                            <TableCell>{new Intl.DateTimeFormat('vi-VN').format(new Date(job.postedAt))}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <Button
                                        onClick={() => setJobPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={jobPage === 1}
                                        variant="outlined"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => setJobPage((prev) => prev + 1)}
                                        disabled={jobPage * itemsPerPage >= jobs.length}
                                        variant="outlined"
                                        className="ml-2"
                                    >
                                        Next
                                    </Button>
                                </div>
                                <Button onClick={fetchJobs} variant="contained" color="primary">
                                    Cập nhật
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "Công Ty" && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" className="font-bold mb-4">Danh Sách Công Ty</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Tên Công Ty</TableCell>
                                        <TableCell>Logo</TableCell>
                                        <TableCell>Số điện thoại</TableCell>
                                        <TableCell>Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginate(companies, companyPage).map((company) => (
                                        <TableRow key={company.companyId}>
                                            <TableCell>{company.companyId}</TableCell>
                                            <TableCell>{company.companyName}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={company.logoPath}
                                                    alt="Logo công ty"
                                                    className="w-14 h-14 object-contain rounded"
                                                />
                                            </TableCell>

                                            <TableCell>{company.phoneNumber}</TableCell>
                                            <TableCell>{company.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <Button
                                        onClick={() => setCompanyPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={companyPage === 1}
                                        variant="outlined"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => setCompanyPage((prev) => prev + 1)}
                                        disabled={companyPage * itemsPerPage >= companies.length}
                                        variant="outlined"
                                        className="ml-2"
                                    >
                                        Next
                                    </Button>
                                </div>
                                <Button onClick={fetchCompanies} variant="contained" color="primary">
                                    Cập nhật
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "Người Tìm Việc" && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" className="font-bold mb-4">Danh Sách Người Tìm Việc</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Họ Tên</TableCell>
                                        <TableCell>Chức Danh</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Số Điện Thoại</TableCell>
                                        <TableCell>Ngày Sinh</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginate(jobSeekers, jobSeekerPage).map((seeker) => (
                                        <TableRow key={seeker.profileId}>
                                            <TableCell>{seeker.profileId}</TableCell>
                                            <TableCell>{seeker.firstName} {seeker.lastName} </TableCell>
                                            <TableCell>{seeker.title}</TableCell>
                                            <TableCell>{seeker.email}</TableCell>
                                            <TableCell>{seeker.phone}</TableCell>
                                            <TableCell>{seeker.birthDay}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <Button
                                        onClick={() => setJobSeekerPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={jobSeekerPage === 1}
                                        variant="outlined"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => setJobSeekerPage((prev) => prev + 1)}
                                        disabled={jobSeekerPage * itemsPerPage >= jobSeekers.length}
                                        variant="outlined"
                                        className="ml-2"
                                    >
                                        Next
                                    </Button>
                                </div>
                                <Button onClick={fetchJobSeekers} variant="contained" color="primary">
                                    Cập nhật
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            <JobDetailModal
                open={openJobModal}
                onClose={handleCloseJobModal}
                job={selectedJob}
                onApprove={handleApproveJob}
                onViewApplications={handleOpenApplicationsModal}
            />
            <ApplicationListModal
                open={openApplicationsModal}
                onClose={handleCloseApplicationsModal}
                applications={jobApplications}
            />
        </div>

    );

};

export default AdminDashboard;