import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faAngleDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import filtersData from '../../data/filters';
import jobApi from '../../api/jobApi';

const RecruiterApplication = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    location: [],
    isActive: "",
    jobType: "",
  });
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef(null);
  const [jobData, setJobData] = useState([]);
  const user = localStorage.getItem("user");
  const userObject = user ? JSON.parse(user) : null;
  const companyId = userObject?.userId;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobApi.getByCompanyId(companyId, companyId);
        setJobData(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách jobs:", error);
      }
    };

    fetchJobs();

    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleLocationChange = (location) => {
    if (location === "Tất cả") {
      setFilters({ ...filters, location: [] });
    } else {
      const newLocations = filters.location.includes(location)
        ? filters.location.filter((loc) => loc !== location)
        : [...filters.location, location];
      setFilters({ ...filters, location: newLocations });
    }
  };

  const clearFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      location: [],
      isActive: "",
      jobType: "",
    });
  };

  const filteredJobs = jobData.filter((job) => {
    const postedDate = new Date(job.postedAt);
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;

    return (
      (filters.location.length === 0 || filters.location.includes(job.location)) &&
      (!filters.jobType || job.jobType === filters.jobType) &&
      (filters.isActive === "" || job.isActive === (filters.isActive === "true")) &&
      (!from || postedDate >= from) &&
      (!to || postedDate <= to)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-green-600 to-blue-500 text-transparent bg-clip-text">
        Quản Lý Tin Tuyển Dụng
      </h1>

      {/* Filters Frame */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-md rounded-lg p-4 mb-8">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faFilter} className="text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Bộ Lọc</h2>
        </div>
        <div className="space-y-4">
          {/* Row 1: Date Filters */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="fromDate" className="text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleChange}
                className="border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="toDate" className="text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleChange}
                className="border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
          </div>
          {/* Row 2: Other Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
              <div className="relative" ref={locationRef}>
                <div
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="flex items-center justify-between border p-3 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faLocationDot} className="text-green-600" />
                    <span className="ml-2 text-gray-600">
                      {filters.location.length === 0
                        ? "Địa điểm"
                        : filters.location.length === 1
                          ? filters.location[0]
                          : `${filters.location[0]} (+${filters.location.length - 1})`}
                    </span>
                  </div>
                  <FontAwesomeIcon icon={faAngleDown} className="text-gray-600" />
                </div>
                {isLocationOpen && (
                  <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-10 p-3 max-h-60 overflow-y-auto transition-all duration-200">
                    {filtersData.find(f => f.key === "Địa điểm")?.list.map((loc, index) => (
                      <label key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                        <input
                          type="checkbox"
                          checked={loc === "Tất cả" ? filters.location.length === 0 : filters.location.includes(loc)}
                          onChange={() => handleLocationChange(loc)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
                        />
                        <span className="text-gray-700">{loc}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                name="isActive"
                value={filters.isActive}
                onChange={handleChange}
                className="border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang hoạt động</option>
                <option value="false">Đã ẩn</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="jobType" className="text-sm font-medium text-gray-700 mb-1">Loại công việc</label>
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleChange}
                className="border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >
                <option value="">Tất cả loại công việc</option>
                <option value="FULLTIME">FULLTIME</option>
                <option value="PARTTIME">PARTTIME</option>
                <option value="INTERNSHIP">INTERNSHIP</option>
                <option value="FREELANCE">FREELANCE</option>
              </select>
            </div>
          </div>
          {/* Clear Filter Button */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transform hover:scale-105 transition"
            >
              Xóa Bộ Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.jobId}
            className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                <p className="text-gray-700 font-medium mt-1">{job.company.companyName}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
              >
                {job.isActive ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-500 text-sm mt-2">
              <p>{job.location}</p>
              <p>{job.jobType}</p>
              <p>Đăng ngày: {new Date(job.postedAt).toLocaleDateString("vi-VN")}</p>
            </div>
            <p className="text-gray-600 mt-3">{job.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-500">
              Lương: ${job.salaryMin} - ${job.salaryMax}
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 py-6 bg-white rounded-lg shadow-sm">
            Không tìm thấy công việc nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplication;