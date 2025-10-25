import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faCalendarAlt,
    faBriefcase,
    faMapMarkerAlt,
    faTag,
    faTimes,
    faClock,
    faMicrophone,
    faCheckCircle,
    faTimesCircle,
    faBuilding,
    faUser,
    faFileAlt,
    faTools,
} from '@fortawesome/free-solid-svg-icons';
import applicationApi from '../../api/applicationApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { transformJobSeekerData } from '../../untils/jobSeekerHelpers';

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
    const modalContentRef = useRef(null);

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

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years > 0 ? years + " năm" : ""}${months > 0 ? (years > 0 ? " " : "") + months + " tháng" : ""}`;
    };

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
                    {applications.map((app) => (
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

            {/* Modal chi tiết ứng tuyển */}
            {isModalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div
                        ref={modalContentRef}
                        className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl transform transition-all duration-300 scale-100"
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
                        >
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>

                        {/* Timeline trạng thái */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600" />
                                Lịch sử trạng thái
                            </h2>
                            {selectedApplication.statusDTOList.length > 0 ? (
                                <div className="flex items-center gap-8 overflow-x-auto pb-4">
                                    {selectedApplication.statusDTOList.map((status, index) => (
                                        <div key={index} className="flex-shrink-0 text-center relative">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(
                                                    status.status
                                                )} mb-2`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={getStatusIcon(status.status)}
                                                    className="text-white"
                                                />
                                            </div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {getStatusText(status.status)}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatDateTime(status.time)}</p>
                                            {index < selectedApplication.statusDTOList.length - 1 && (
                                                <div className="absolute top-5 left-12 w-28 h-1 bg-gray-300"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">Không có lịch sử trạng thái</p>
                            )}
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTag} className="text-gray-500" />
                                    Cập nhật trạng thái
                                </h3>
                                <select
                                    onChange={(e) =>
                                        handleUpdateStatus(selectedApplication.applicationId, e.target.value)
                                    }
                                    className="mt-2 w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Cập nhật trạng thái
                                    </option>
                                    {getAvailableStatuses(
                                        selectedApplication.statusDTOList[
                                            selectedApplication.statusDTOList.length - 1
                                        ]?.status
                                    ).map((status) => (
                                        <option key={status} value={status}>
                                            {getStatusText(status)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Hai cột: Job và JobSeeker */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Bên trái: Thông tin công việc */}
                            <div className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
                                    Thông tin công việc
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faTag} className="text-gray-500" />
                                            Tiêu đề
                                        </h3>
                                        <p className="text-gray-600">{selectedApplication.job.title}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faBuilding} className="text-gray-500" />
                                            Công ty
                                        </h3>
                                        <p className="text-gray-600">
                                            {selectedApplication.job.company.companyName}
                                        </p>
                                        <p className="text-gray-600">
                                            Ngành: {selectedApplication.job.company.industry[0]?.name}
                                        </p>
                                        <a
                                            href={selectedApplication.job.company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {selectedApplication.job.company.website}
                                        </a>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faTools} className="text-gray-500" />
                                            Kỹ năng yêu cầu
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedApplication.job.skills.length > 0 ? (
                                                selectedApplication.job.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-600">Không có kỹ năng</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faTag} className="text-gray-500" />
                                            Danh mục
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedApplication.job.categories.length > 0 ? (
                                                selectedApplication.job.categories.map((category, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                                                    >
                                                        {category.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-600">Không có danh mục</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            Mô tả
                                        </h3>
                                        <div
                                            className="text-gray-600 prose max-w-none"
                                            dangerouslySetInnerHTML={{ __html: selectedApplication.job.description }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            Yêu cầu
                                        </h3>
                                        <div
                                            className="text-gray-600 prose max-w-none"
                                            dangerouslySetInnerHTML={{ __html: selectedApplication.job.requirements }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            Quyền lợi
                                        </h3>
                                        <div
                                            className="text-gray-600 prose max-w-none"
                                            dangerouslySetInnerHTML={{ __html: selectedApplication.job.benefits }}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faTag} className="text-gray-500" />
                                            Thông tin khác
                                        </h3>
                                        <p className="text-gray-600">
                                            Lương: {selectedApplication.job.salaryMin} -{' '}
                                            {selectedApplication.job.salaryMax}
                                        </p>
                                        <p className="text-gray-600">Địa điểm: {selectedApplication.job.location}</p>
                                        <p className="text-gray-600">Hình thức: {selectedApplication.job.jobType}</p>
                                        <p className="text-gray-600">
                                            Hạn chót: {formatDate(selectedApplication.job.deadline)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bên phải: Thông tin ứng viên */}
                            <div className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                                    Thông tin ứng viên
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={selectedApplication.jobSeekerProfile.avatar}
                                            alt={`${selectedApplication.jobSeekerProfile.firstName} ${selectedApplication.jobSeekerProfile.lastName}`}
                                            className="w-20 h-20 rounded-full object-cover shadow-sm"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700">
                                                {selectedApplication.jobSeekerProfile.firstName}{' '}
                                                {selectedApplication.jobSeekerProfile.lastName}
                                            </h3>
                                            <p className="text-gray-600">
                                                {selectedApplication.jobSeekerProfile.title}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faTag} className="text-gray-500" />
                                            Liên hệ
                                        </h3>
                                        <p className="text-gray-600">
                                            Email: {selectedApplication.jobSeekerProfile.email}
                                        </p>
                                        <p className="text-gray-600">
                                            Số điện thoại: {selectedApplication.jobSeekerProfile.phone}
                                        </p>
                                        <p className="text-gray-600">
                                            Địa chỉ: {selectedApplication.jobSeekerProfile.address}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faTools} className="text-gray-500" />
                                            Kỹ năng
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedApplication.jobSeekerProfile.skills.length > 0 ? (
                                                selectedApplication.jobSeekerProfile.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-600">Không có kỹ năng</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faBriefcase} className="text-gray-500" />
                                            Kinh nghiệm làm việc
                                        </h3>
                                        {selectedApplication.jobSeekerProfile.workExperiences.length > 0 ? (
                                            selectedApplication.jobSeekerProfile.workExperiences.map((exp, index) => (
                                                <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                                                    <p className="text-gray-700 font-semibold">{exp.jobTitle}</p>
                                                    <p className="text-gray-600">{exp.companyName}</p>
                                                    <p className="text-gray-600">
                                                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Hiện tại'} • {calculateDuration(exp.startDate, exp.endDate)}
                                                    </p>
                                                    <div
                                                        className="text-gray-600 prose max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: exp.description }}
                                                    />
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {exp.skills.map((skill, skillIndex) => (
                                                            <span
                                                                key={skillIndex}
                                                                className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                                                            >
                                                                {skill.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600">Không có kinh nghiệm làm việc</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                            Resume đã nộp
                                        </h3>
                                        {selectedApplication.resumeApplied ? (
                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                <a
                                                    href={selectedApplication.resumeApplied.resumePath}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center gap-2"
                                                >
                                                    <FontAwesomeIcon icon={faFileAlt} />
                                                    Xem resume
                                                </a>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">Không có resume</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsPage;