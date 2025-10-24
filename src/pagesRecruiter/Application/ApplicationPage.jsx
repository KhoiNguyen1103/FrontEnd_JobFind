import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt, faBriefcase, faMapMarkerAlt, faTag } from '@fortawesome/free-solid-svg-icons';
import applicationApi from '../../api/applicationApi';
import { transformJobSeekerData } from '../../untils/jobSeekerHelpers';

const ApplicationsPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await applicationApi.getApplicationOfJob(jobId);
                const transformedData = transformJobSeekerData(
                    response.map(app => app.jobSeekerProfileDTO)
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

    const handleViewDetails = (applicationId) => {
        navigate(`/application/${applicationId}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'INTERVIEWING':
                return 'bg-blue-100 text-blue-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
            </div>

            {applications.errorCode === 400 ? (
                <div className="text-center text-gray-600 py-12">
                    <p className="text-xl">Chưa có ứng viên nào ứng tuyển cho công việc này.</p>
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
                                                    className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded"
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
                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>
                                        {app.status === 'INTERVIEWING' ? 'Đang phỏng vấn' :
                                            app.status === 'PENDING' ? 'Đang chờ' :
                                                app.status === 'APPROVED' ? 'Đã duyệt' :
                                                    app.status === 'REJECTED' ? 'Đã từ chối' : app.status}
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
        </div>
    );
};

export default ApplicationsPage;