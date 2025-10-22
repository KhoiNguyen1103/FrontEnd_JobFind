import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faAngleDown, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import filtersData from '../../data/filters';
import jobApi from '../../api/jobApi';
import jobCategoryApi from '../../api/jobCategoryApi';
import skillApi from '../../api/skillApi';
import TipTapEditor from '../../untils/tipTapEditorHelper';
import Select from 'react-select';
import {
  faAngleRight,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";

const RecruiterApplication = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    location: [],
    isActive: "",
    jobType: "",
  });
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState([]);
  const locationRef = useRef(null);
  const user = localStorage.getItem("user");
  const userObject = user ? JSON.parse(user) : null;
  const companyId = userObject?.userId;
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);

  const skillOptions = skills.map((skill) => ({
    value: skill.skillId,
    label: skill.name,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.jobCategoryId,
    label: category.name,
  }));

  const [newJob, setNewJob] = useState({
    companyId,
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    salaryMin: 0,
    salaryMax: 0,
    jobType: "",
    location: "",
    deadline: "",
    skillIds: [],
    categoryIds: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobApi.getByCompanyId(companyId, companyId);
        setJobData(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách jobs:", error);
      }
    };

    if (companyId) fetchJobs();

    const fetchSkills = async () => {
      try {
        const res = await skillApi.getAll();
        setSkills(res);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await jobCategoryApi.getAll();
        setCategories(res);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchSkills();
    fetchCategories();
    setCurrentPage(1);

    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filters]);

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

  const handleNewJobChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleEditorChange = (name) => (value) => {
    setNewJob({ ...newJob, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleMultiSelectChange = (fieldName) => (selectedValues) => {
    setNewJob((prev) => ({
      ...prev,
      [fieldName]: selectedValues,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newJob.title) newErrors.title = "Tiêu đề là bắt buộc";
    if (!newJob.description) newErrors.description = "Mô tả là bắt buộc";
    if (!newJob.requirements) newErrors.requirements = "Yêu cầu là bắt buộc";
    if (!newJob.benefits) newErrors.benefits = "Quyền lợi là bắt buộc";
    if (!newJob.salaryMin || newJob.salaryMin < 0) newErrors.salaryMin = "Lương tối thiểu phải >= 0";
    if (!newJob.salaryMax || newJob.salaryMax < 0) newErrors.salaryMax = "Lương tối đa phải >= 0";
    if (!newJob.jobType) newErrors.jobType = "Hình thức làm việc là bắt buộc";
    if (!newJob.location) newErrors.location = "Địa điểm là bắt buộc";
    if (!newJob.deadline) newErrors.deadline = "Hạn chót là bắt buộc";
    return newErrors;
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await jobApi.create(newJob);

      if (response.statusCode === 200) {
        const updatedJobs = await jobApi.getByCompanyId(companyId, companyId);
        setJobData(updatedJobs);

        setNewJob({
          companyId,
          title: "",
          description: "",
          requirements: "",
          benefits: "",
          salaryMin: 0,
          salaryMax: 0,
          jobType: "",
          location: "",
          deadline: "",
          skillIds: [],
          categoryIds: [],
        });
        setIsModalOpen(false);
      } else {
        setErrors({ submit: response.message || "Tạo công việc thất bại" });
      }
    } catch (error) {
      console.error("Lỗi khi tạo job:", error);
      setErrors({ submit: "Không thể tạo công việc. Vui lòng thử lại." });
    }
  };


  const filteredJobs = jobData
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
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
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-blue-500 text-transparent bg-clip-text">
          Quản Lý Tin Tuyển Dụng
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transform hover:scale-105 transition flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm Công Việc
        </button>
      </div>

      {/* Filters Frame */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-md rounded-lg p-4 mb-8">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faFilter} className="text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Bộ Lọc</h2>
        </div>
        <div className="space-y-2">
          {/* Row 1: Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="true">Đã đăng</option>
                <option value="false">Ẩn</option>
                <option value="pending">Chờ duyệt</option>
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
                {filtersData
                  .find(f => f.key === "Hình thức làm việc")
                  ?.list.filter(item => item.name !== "Tất cả")
                  .map((item, index) => (
                    <option key={index} value={item.name}>{item.name}</option>
                  ))}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedJobs.map((job) => (
          <div
            key={job.jobId}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02] duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
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
              💰 Lương: <span className="text-gray-900">{job.salaryMin} triệu - {job.salaryMax} triệu</span>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-6 bg-white rounded-xl shadow-sm">
            Không tìm thấy công việc nào.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center pt-8 space-x-6">
        <FontAwesomeIcon
          icon={faAngleLeft}
          className={`text-xl ${currentPage > 1
            ? "text-gray-700 cursor-pointer hover:text-primary"
            : "opacity-40 cursor-not-allowed"
            }`}
          onClick={decreasePagination}
        />
        <p className="text-sm text-gray-600">
          Trang <span className="font-semibold text-primary">{currentPage}</span> / <span className="text-gray-500">{maxPageCount}</span>
        </p>
        <FontAwesomeIcon
          icon={faAngleRight}
          className={`text-xl ${currentPage < maxPageCount
            ? "text-gray-700 cursor-pointer hover:text-primary"
            : "opacity-40 cursor-not-allowed"
            }`}
          onClick={increasePagination}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10 rounded-t-xl">
              <h2 className="text-2xl font-bold text-gray-800">Thêm Công Việc Mới</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-6">
              <form onSubmit={handleSubmitJob}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                    <input
                      type="text"
                      name="title"
                      value={newJob.title}
                      onChange={handleNewJobChange}
                      className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                      placeholder="Nhập tiêu đề công việc"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Địa điểm *</label>
                    <select
                      name="location"
                      value={newJob.location}
                      onChange={handleNewJobChange}
                      className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Chọn địa điểm</option>
                      {filtersData
                        .find(f => f.key === "Địa điểm")
                        ?.list.filter(loc => loc !== "Tất cả")
                        .map((loc, index) => (
                          <option key={index} value={loc}>{loc}</option>
                        ))}
                    </select>
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Hình thức làm việc *</label>
                    <select
                      name="jobType"
                      value={newJob.jobType}
                      onChange={handleNewJobChange}
                      className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Chọn hình thức</option>
                      {filtersData
                        .find(f => f.key === "Hình thức làm việc")
                        ?.list.filter(item => item.name !== "Tất cả")
                        .map((item, index) => (
                          <option key={index} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                    {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Hạn chót *</label>
                    <input
                      type="date"
                      name="deadline"
                      value={newJob.deadline}
                      onChange={handleNewJobChange}
                      className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                    />
                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Lương tối thiểu *</label>
                    <input
                      type="number"
                      name="salaryMin"
                      value={newJob.salaryMin}
                      onChange={handleNewJobChange}
                      className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                      min="0"
                    />
                    {errors.salaryMin && <p className="text-red-500 text-sm mt-1">{errors.salaryMin}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Lương tối đa *</label>
                    <input
                      type="number"
                      name="salaryMax"
                      value={newJob.salaryMax}
                      onChange={handleNewJobChange}
                      className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                      min="0"
                    />
                    {errors.salaryMax && <p className="text-red-500 text-sm mt-1">{errors.salaryMax}</p>}
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">Kỹ năng</label>
                    <Select
                      isMulti
                      options={skillOptions}
                      value={skillOptions.filter(opt => newJob.skillIds.includes(opt.value))}
                      onChange={(selectedOptions) =>
                        handleMultiSelectChange("skillIds")(
                          selectedOptions.map((option) => option.value)
                        )
                      }
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Chọn hoặc gõ kỹ năng..."
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <Select
                      isMulti
                      options={categoryOptions}
                      value={categoryOptions.filter(opt => newJob.categoryIds.includes(opt.value))}
                      onChange={(selectedOptions) =>
                        handleMultiSelectChange("categoryIds")(
                          selectedOptions.map((option) => option.value)
                        )
                      }
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Chọn hoặc gõ danh mục..."
                    />
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">Mô tả *</label>
                    <TipTapEditor
                      content={newJob.description}
                      onChange={handleEditorChange("description")}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">Yêu cầu *</label>
                    <TipTapEditor
                      content={newJob.requirements}
                      onChange={handleEditorChange("requirements")}
                    />
                    {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">Quyền lợi *</label>
                    <TipTapEditor
                      content={newJob.benefits}
                      onChange={handleEditorChange("benefits")}
                    />
                    {errors.benefits && <p className="text-red-500 text-sm mt-1">{errors.benefits}</p>}
                  </div>
                </div>
                {errors.submit && <p className="text-red-500 text-sm mt-4">{errors.submit}</p>}
                <div className="flex justify-end mt-6 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplication;