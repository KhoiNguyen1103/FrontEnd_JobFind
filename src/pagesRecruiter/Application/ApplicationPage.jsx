import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faCalendarAlt,
    faBriefcase,
    faMapMarkerAlt,
    faTag,
    faClock,
    faMicrophone,
    faCheckCircle,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import applicationApi from '../../api/applicationApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { transformJobSeekerData } from '../../untils/jobSeekerHelpers';
import ApplicationStatusModal from './ApplicationStatusModal'; 

const ApplicationsPage = () => {
    const location = useLocation();
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortStatus, setSortStatus] = useState('');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await applicationApi.getApplicationOfJob(jobId);
                const transformedData = transformJobSeekerData(
                    response.map((app) => app.jobSeekerProfileDTO)
                ).map((transformed, index) => ({
                    ...transformed,
                    applicationId: response[index].applicationId,
                    appliedAt: response[index].appliedAt,
                    status: response[index].status,
                }));
                setApplications(transformedData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Chưa có ứng viên nào ứng tuyển cho công việc này.');
                setLoading(false);
            }
        };
        fetchApplications();
    }, [jobId]);


    const filteredApplications = sortStatus ? applications.filter((app) => app.status === sortStatus) : applications;

    const handleViewDetails = async (applicationId) => {
        try {
            const response = await applicationApi.getApplicationHistory(applicationId);
            setSelectedApplication(response);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error fetching application history:', err);
            setError('Không thể tải chi tiết ứng tuyển.');
        }
    };

    const handleUpdateStatus = async (applicationId, newStatus) => {
        try {
            await applicationApi.updateApplicationStatus(applicationId, newStatus);
            toast.success('Cập nhật trạng thái thành công!', { autoClose: 500 });
            setApplications((prevApplications) =>
                prevApplications.map((app) =>
                    app.applicationId === applicationId ? { ...app, status: newStatus } : app
                )
            );
            setSelectedApplication((prev) => ({
                ...prev,
                statusDTOList: [
                    ...prev.statusDTOList,
                    {
                        status: newStatus,
                        time: new Date().toISOString(),
                    },
                ],
            }));
        } catch (err) {
            console.error('Error updating application status:', err);
            toast.error('Có lỗi khi cập nhật trạng thái.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApplication(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })} ${date.toLocaleTimeString('vi-VN')}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'INTERVIEWING':
                return 'bg-blue-300 text-blue-800';
            case 'PENDING':
                return 'bg-yellow-300 text-yellow-800';
            case 'HIRED':
                return 'bg-green-200 text-green-800';
            case 'REJECTED':
                return 'bg-red-300 text-red-800';
            case 'REVIEWING':
                return 'bg-pink-300 text-pink-800';
            default:
                return 'bg-gray-300 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'INTERVIEWING':
                return faMicrophone;
            case 'PENDING':
                return faClock;
            case 'HIRED':
                return faCheckCircle;
            case 'REJECTED':
                return faTimesCircle;
            default:
                return faTag;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'INTERVIEWING':
                return 'Đang phỏng vấn';
            case 'PENDING':
                return 'Đang chờ';
            case 'HIRED':
                return 'Đã thuê';
            case 'REJECTED':
                return 'Đã từ chối';
            case 'REVIEWING':
                return 'Đang xem xét';
            case 'SHORTLISTED':
                return 'Danh sách sơ tuyển';
            default:
                return status;
        }
    };

    const getAvailableStatuses = (currentStatus) => {
        const allStatuses = [
            'PENDING',
            'REVIEWING',
            'SHORTLISTED',
            'REJECTED',
            'INTERVIEWING',
            'HIRED',
        ];
        return currentStatus === 'PENDING'
            ? allStatuses
            : allStatuses.filter((status) => status !== 'PENDING');
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years > 0 ? years + ' năm' : ''}${months > 0 ? (years > 0 ? ' ' : '') + months + ' tháng' : ''}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-blue-500 text-transparent bg-clip-text">
                        Danh Sách Ứng Tuyển
                    </h1>
                </div>
                <div>
                    <select
                        value={sortStatus}
                        onChange={(e) => setSortStatus(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        <option value="">Tất cả trạng thái</option>
                        {[
                            'PENDING',
                            'REVIEWING',
                            'SHORTLISTED',
                            'REJECTED',
                            'INTERVIEWING',
                            'HIRED',
                        ].map((status) => (
                            <option key={status} value={status}>
                                {getStatusText(status)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="text-center text-gray-600 py-12">
                    <p className="text-xl">Không tìm thấy đơn ứng tuyển nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((app) => (
                        <div
                            key={app.applicationId}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={app.avatar}
                                    alt={`${app.firstName} ${app.lastName}`}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {app.firstName} {app.lastName}
                                    </h2>
                                    <p className="text-gray-600">{app.title}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />
                                    <span className="text-gray-700">{app.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faBriefcase} className="text-gray-500" />
                                    <span className="text-gray-700">
                                        {app.workExperiences} năm kinh nghiệm
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                                    <span className="text-gray-700">
                                        Ứng tuyển: {formatDate(app.appliedAt)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-wrap gap-2">
                                        {app.skills.length > 0 ? (
                                            app.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-600">Không có kỹ năng</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                                            app.status
                                        )}`}
                                    >
                                        {getStatusText(app.status)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleViewDetails(app.applicationId)}
                                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Xem Chi Tiết
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <ApplicationStatusModal
                isOpen={isModalOpen}
                onClose={closeModal}
                application={selectedApplication}
                handleUpdateStatus={handleUpdateStatus}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getStatusText={getStatusText}
                getAvailableStatuses={getAvailableStatuses}
                formatDate={formatDate}
                formatDateTime={formatDateTime}
                calculateDuration={calculateDuration}
            />
        </div>
    );
};

export default ApplicationsPage;