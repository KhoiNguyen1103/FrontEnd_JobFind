import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faCalendarAlt,
    faBuilding,
    faUser,
    faTag,
    faTools,
    faBriefcase,
    faFileAlt,
} from '@fortawesome/free-solid-svg-icons';

const ApplicationStatusModal = ({
    isOpen,
    onClose,
    application,
    handleUpdateStatus,
    getStatusColor,
    getStatusIcon,
    getStatusText,
    getAvailableStatuses,
    formatDate,
    formatDateTime,
    calculateDuration,
}) => {
    const modalContentRef = useRef(null);

    if (!isOpen || !application) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
            <div
                ref={modalContentRef}
                className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl transform transition-all duration-300 scale-100"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600" />
                        Lịch sử trạng thái
                    </h2>
                    {application.statusDTOList.length > 0 ? (
                        <div className="flex items-center gap-8 overflow-x-auto pb-4">
                            {application.statusDTOList.map((status, index) => (
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
                                    {index < application.statusDTOList.length - 1 && (
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
                            onChange={(e) => handleUpdateStatus(application.applicationId, e.target.value)}
                            className="mt-2 w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Cập nhật trạng thái
                            </option>
                            {getAvailableStatuses(
                                application.statusDTOList[application.statusDTOList.length - 1]?.status
                            ).map((status) => (
                                <option key={status} value={status}>
                                    {getStatusText(status)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                <p className="text-gray-600">{application.job.title}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faBuilding} className="text-gray-500" />
                                    Công ty
                                </h3>
                                <p className="text-gray-600">{application.job.company.companyName}</p>
                                <p className="text-gray-600">
                                    Ngành: {application.job.company.industry[0]?.name}
                                </p>
                                <a
                                    href={application.job.company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {application.job.company.website}
                                </a>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTools} className="text-gray-500" />
                                    Kỹ năng yêu cầu
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {application.job.skills.length > 0 ? (
                                        application.job.skills.map((skill, index) => (
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
                                    {application.job.categories.length > 0 ? (
                                        application.job.categories.map((category, index) => (
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
                                    dangerouslySetInnerHTML={{ __html: application.job.description }}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    Yêu cầu
                                </h3>
                                <div
                                    className="text-gray-600 prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: application.job.requirements }}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    Quyền lợi
                                </h3>
                                <div
                                    className="text-gray-600 prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: application.job.benefits }}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTag} className="text-gray-500" />
                                    Thông tin khác
                                </h3>
                                <p className="text-gray-600">
                                    Lương: {application.job.salaryMin / 1000000} - {application.job.salaryMax / 1000000}
                                </p>
                                <p className="text-gray-600">Địa điểm: {application.job.location}</p>
                                <p className="text-gray-600">Hình thức: {application.job.jobType}</p>
                                <p className="text-gray-600">Hạn chót: {formatDate(application.job.deadline)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                            Thông tin ứng viên
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={application.jobSeekerProfile.avatar}
                                    alt={`${application.jobSeekerProfile.firstName} ${application.jobSeekerProfile.lastName}`}
                                    className="w-20 h-20 rounded-full object-cover shadow-sm"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        {application.jobSeekerProfile.firstName}{' '}
                                        {application.jobSeekerProfile.lastName}
                                    </h3>
                                    <p className="text-gray-600">{application.jobSeekerProfile.title}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTag} className="text-gray-500" />
                                    Liên hệ
                                </h3>
                                <p className="text-gray-600">Email: {application.jobSeekerProfile.email}</p>
                                <p className="text-gray-600">
                                    Số điện thoại: {application.jobSeekerProfile.phone}
                                </p>
                                <p className="text-gray-600">
                                    Địa chỉ: {application.jobSeekerProfile.address}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTools} className="text-gray-500" />
                                    Kỹ năng
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {application.jobSeekerProfile.skills.length > 0 ? (
                                        application.jobSeekerProfile.skills.map((skill, index) => (
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
                                {application.jobSeekerProfile.workExperiences.length > 0 ? (
                                    application.jobSeekerProfile.workExperiences.map((exp, index) => (
                                        <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                                            <p className="text-gray-700 font-semibold">{exp.jobTitle}</p>
                                            <p className="text-gray-600">{exp.companyName}</p>
                                            <p className="text-gray-600">
                                                {formatDate(exp.startDate)} -{' '}
                                                {exp.endDate ? formatDate(exp.endDate) : 'Hiện tại'} •{' '}
                                                {calculateDuration(exp.startDate, exp.endDate)}
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
                                {application.resumeApplied ? (
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <a
                                            href={application.resumeApplied.resumePath}
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
    );
};

export default ApplicationStatusModal;