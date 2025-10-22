import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faAngleDown, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import filtersData from '../../data/filters';
import jobApi from '../../api/jobApi';
import jobCategoryApi from '../../api/jobCategoryApi';
import skillApi from '../../api/skillApi';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Select from 'react-select';
import DOMPurify from 'dompurify';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaHeading,
  FaListUl,
  FaListOl,
  FaEraser,
} from 'react-icons/fa';

const ToolbarButton = ({ onClick, active, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center w-9 h-9 rounded-md border 
      ${active ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}
      hover:bg-green-400 hover:text-white transition-all duration-200`}
    title={label}
  >
    <Icon size={14} />
  </button>
);

const TipTapToolbar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border-b rounded-t-md">
      <ToolbarButton
        icon={FaBold}
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      />
      <ToolbarButton
        icon={FaItalic}
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      />
      <ToolbarButton
        icon={FaUnderline}
        label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
      />
      <ToolbarButton
        icon={FaHeading}
        label="Heading 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
      />
      <ToolbarButton
        icon={FaHeading}
        label="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
      />
      <ToolbarButton
        icon={FaListUl}
        label="Bullet List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      />
      <ToolbarButton
        icon={FaListOl}
        label="Ordered List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      />
      <ToolbarButton
        icon={FaEraser}
        label="Clear Formatting"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        active={false}
      />
    </div>
  );
};

const TipTapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-300 rounded-md shadow-sm bg-white">
      <TipTapToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="p-4 min-h-[150px] focus:outline-none focus:ring-0 focus:border-green-500 caret-green-600 text-gray-800"
      />
    </div>
  );
};

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

    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [companyId]);

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
      setJobData([...jobData, response.data]);
      setIsModalOpen(false);
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
    } catch (error) {
      console.error("Lỗi khi tạo job:", error);
      setErrors({ submit: "Không thể tạo công việc. Vui lòng thử lại." });
    }
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
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
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
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faFilter} className="text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Bộ Lọc</h2>
        </div>
        <div className="space-y-6">
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
                <option value="true">Đang hoạt động</option>
                <option value="false">Không hoạt động</option>
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
      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <div
            key={job.jobId}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className='flex'>
                  <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                  <div className="flex flex-wrap gap-2 ml-5">
                    {job.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-sm"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
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
            {/* <p
              className="text-gray-600 mt-3"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.description)
              }}
            /> */}
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
              Lương: {job.salaryMin} triệu - {job.salaryMax} triệu
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 py-6 bg-white rounded-lg shadow-sm">
            Không tìm thấy công việc nào.
          </p>
        )}
      </div>

      {/* Modal for Adding Job */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm Công Việc Mới</h2>
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
      )}
    </div>
  );
};

export default RecruiterApplication;