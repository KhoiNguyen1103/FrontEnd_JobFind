import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const JobList = ({ jobs, filters, onJobClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredJobs = jobs
        .filter((job) => {
            const postedDate = new Date(job.postedAt);
            const from = filters.fromDate ? new Date(filters.fromDate) : null;
            const to = filters.toDate ? new Date(filters.toDate) : null;

            const matchLocation = filters.location.length === 0 || filters.location.includes(job.location);
            const matchJobType = !filters.jobType || job.jobType === filters.jobType;
            const matchDate = (!from || postedDate >= from) && (!to || postedDate <= to);

            let matchStatus = true;
            if (filters.isActive === "true" || filters.isActive === "false") {
                matchStatus = job.isActive === (filters.isActive === "true") && job.isApproved;
            } else if (filters.isActive === "pending") {
                matchStatus = job.isApproved === false;
            }

            return matchLocation && matchJobType && matchDate && matchStatus;
        })
        .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    const maxPageCount = Math.ceil(filteredJobs.length / itemsPerPage);
    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const increasePagination = () => {
        if (currentPage < maxPageCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    const decreasePagination = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedJobs.map((job) => (
                    <div
                        key={job.jobId}
                        className="p-6 bg-gradient-to-r from-purple-50 to-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02] duration-300"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h2
                                    className="text-xl font-bold text-gray-900 cursor-pointer hover:text-green-600 transition"
                                    onClick={() => onJobClick(job)}
                                >
                                    {job.title}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">{job.company.companyName}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {job.categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-200 transition"
                                        >
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap
                  ${!job.isApproved
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : job.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {!job.isApproved
                                    ? '⏳ Chờ duyệt'
                                    : job.isActive
                                        ? '🟢 Đã đăng'
                                        : '🔴 Ẩn'}
                            </span>
                        </div>
                        <div className="text-base text-gray-500 space-y-1 mb-4">
                            <p>📍 {job.location}</p>
                            <p>💼 {job.jobType}</p>
                            <p>🗓️ Đăng ngày: {new Date(job.postedAt).toLocaleDateString("vi-VN")}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 mb-4">
                            {job.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                        <div className="text-base font-medium text-gray-700 mt-auto">
                            💰 Lương: <span className="text-gray-900">{job.salaryMin / 1000000}  triệu - {job.salaryMax / 1000000} triệu</span>
                        </div>
                    </div>
                ))}
                {filteredJobs.length === 0 && (
                    <p className="col-span-full text-center text-gray-500 py-6 bg-white rounded-xl shadow-sm">
                        Không tìm thấy công việc nào.
                    </p>
                )}
            </div>
            {filteredJobs.length > 0 && (
                <div className="flex justify-center items-center pt-8 space-x-6">
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        className={`text-xl ${currentPage > 1
                            ? "text-gray-700 cursor-pointer hover:text-green-600"
                            : "opacity-40 cursor-not-allowed"
                            }`}
                        onClick={decreasePagination}
                    />
                    <p className="text-sm text-gray-600">
                        Trang <span className="font-semibold text-green-600">{currentPage}</span> / <span className="text-gray-500">{maxPageCount}</span>
                    </p>
                    <FontAwesomeIcon
                        icon={faAngleRight}
                        className={`text-xl ${currentPage < maxPageCount
                            ? "text-gray-700 cursor-pointer hover:text-green-600"
                            : "opacity-40 cursor-not-allowed"
                            }`}
                        onClick={increasePagination}
                    />
                </div>
            )}
        </>
    );
};

export default JobList;