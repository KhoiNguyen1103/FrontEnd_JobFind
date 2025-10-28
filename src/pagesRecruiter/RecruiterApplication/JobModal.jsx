import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import TipTapEditor from '../../untils/tipTapEditorHelper';
import jobApi from '../../api/jobApi';
import filtersData from '../../data/filters';

const JobModal = ({ mode, setMode, job, skills, categories, companyId, onClose, onEdit, onViewApplications, onRefreshJobs }) => {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';

    const educationLevelOptions = [
        { value: 'Đại Học', label: 'Đại Học' },
        { value: 'Cao Đẳng', label: 'Cao Đẳng' },
    ];

    const initialJobState = isViewMode || isEditMode ? {
        ...(job || {}),
        skillIds: job?.skills?.map(s => {
            const matchedSkill = skills.find(sk => sk.name === s.name);
            return matchedSkill?.skillId;
        }) || [],
        categoryIds: job?.categories?.map(c => c.jobCategoryId) || [],
        isActive: job?.isActive ?? false,
        yearsOfExperience: job?.yearsOfExperience ?? 0,
        educationLevel: job?.educationLevel ?? '',
    } : {
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
        isActive: true,
        yearsOfExperience: 0,
        educationLevel: "",
    };

    const [formData, setFormData] = useState(initialJobState);
    const [errors, setErrors] = useState({});

    const skillOptions = skills.map(skill => ({
        value: skill.skillId,
        label: skill.name,
    }));

    const categoryOptions = categories.map(category => ({
        value: category.jobCategoryId,
        label: category.name,
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleEditorChange = (name) => (value) => {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleRadioChange = (e) => {
        const value = e.target.value === 'true';
        setFormData({ ...formData, isActive: value });
        setErrors({ ...errors, isActive: "" });
    };

    const handleMultiSelectChange = (fieldName) => (selectedValues) => {
        setFormData({ ...formData, [fieldName]: selectedValues });
        setErrors({ ...errors, [fieldName]: "" });
    };

    const handleEducationLevelChange = (selectedOption) => {
        setFormData({ ...formData, educationLevel: selectedOption ? selectedOption.value : '' });
        setErrors({ ...errors, educationLevel: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = "Tiêu đề là bắt buộc";
        if (!formData.description) newErrors.description = "Mô tả là bắt buộc";
        if (!formData.requirements) newErrors.requirements = "Yêu cầu là bắt buộc";
        if (!formData.benefits) newErrors.benefits = "Quyền lợi là bắt buộc";
        if (formData.salaryMin === undefined || formData.salaryMin < 0) newErrors.salaryMin = "Lương tối thiểu phải >= 0";
        if (formData.salaryMax === undefined || formData.salaryMax < 0) newErrors.salaryMax = "Lương tối đa phải >= 0";
        if (!formData.jobType) newErrors.jobType = "Hình thức làm việc là bắt buộc";
        if (!formData.location) newErrors.location = "Địa điểm là bắt buộc";
        if (!formData.deadline) newErrors.deadline = "Hạn chót là bắt buộc";
        if (isEditMode && formData.isActive === undefined) newErrors.isActive = "Trạng thái là bắt buộc";
        if (formData.yearsOfExperience === undefined || formData.yearsOfExperience < 0) newErrors.yearsOfExperience = "Số năm kinh nghiệm phải >= 0";
        if (!formData.educationLevel) newErrors.educationLevel = "Trình độ học vấn là bắt buộc";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            if (isEditMode) {
                const response = await jobApi.update(formData.jobId, formData);
                if (response.statusCode === 200) {
                    await onRefreshJobs();
                    setMode('view');
                } else {
                    setErrors({ submit: response.message || "Cập nhật công việc thất bại" });
                }
            } else {
                const response = await jobApi.create(formData);
                if (response.statusCode === 200) {
                    await onRefreshJobs();
                    onClose();
                } else {
                    setErrors({ submit: response.message || "Tạo công việc thất bại" });
                }
            }
        } catch (error) {
            console.error(`Lỗi khi ${isEditMode ? 'cập nhật' : 'tạo'} job:`, error);
            setErrors({ submit: `Không thể ${isEditMode ? 'cập nhật' : 'tạo'} công việc. Vui lòng thử lại.` });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isViewMode ? 'Chi Tiết Công Việc' : isEditMode ? 'Chỉnh Sửa Công Việc' : 'Thêm Công Việc Mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-xl"
                    >
                        ×
                    </button>
                </div>
                <div className="overflow-y-auto p-6 space-y-6">
                    {isViewMode ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
                                <p className="border p-3 rounded-lg bg-gray-50">{formData.title}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Địa điểm</label>
                                <p className="border p-3 rounded-lg bg-gray-50">{formData.location}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Hình thức làm việc</label>
                                <p className="border p-3 rounded-lg bg-gray-50">{formData.jobType}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Hạn chót</label>
                                <p className="border p-3 rounded-lg bg-gray-50">{formData.deadline}</p>
                            </div>
                            <div className='flex'>
                                <div className='mr-16'>
                                    <label className="text-sm font-medium text-gray-700">Lương tối thiểu</label>
                                    <p className="border p-3 px-10 rounded-lg bg-gray-50">{formData.salaryMin} triệu</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Lương tối đa</label>
                                    <p className="border p-3 px-10 rounded-lg bg-gray-50">{formData.salaryMax} triệu</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Số năm kinh nghiệm</label>
                                <p className="border p-3 rounded-lg bg-gray-50">{formData.yearsOfExperience} năm</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Trình độ học vấn</label>
                                <p className="border p-3 rounded-lg bg-gray-50">{formData.educationLevel || 'Không có'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Kỹ năng</label>
                                <p className="border p-3 rounded-lg bg-gray-50">
                                    {formData.skillIds.map(id => skills.find(s => s.skillId === id)?.name).filter(Boolean).join(', ') || 'Không có'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Danh mục</label>
                                <p className="border p-3 rounded-lg bg-gray-50">
                                    {formData.categoryIds.map(id => categories.find(c => c.jobCategoryId === id)?.name).filter(Boolean).join(', ') || 'Không có'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Mô tả</label>
                                <div className="border p-3 rounded-lg bg-gray-50" dangerouslySetInnerHTML={{ __html: formData.description }} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Yêu cầu</label>
                                <div className="border p-3 rounded-lg bg-gray-50" dangerouslySetInnerHTML={{ __html: formData.requirements }} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Quyền lợi</label>
                                <div className="border p-3 rounded-lg bg-gray-50" dangerouslySetInnerHTML={{ __html: formData.benefits }} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                                <p className="border p-3 rounded-lg bg-gray-50">{formData.isActive ? 'Đăng' : 'Ẩn'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Trạng thái duyệt</label>
                                <p className={`border p-3 rounded-lg bg-gray-50 font-semibold
                                    ${formData.isApproved ? 'text-green-600' : formData.note && formData.note.trim() !== '' ? 'text-red-600' : 'text-yellow-600'}`}>
                                    {formData.isApproved
                                        ? '🟢 Đã duyệt'
                                        : formData.note && formData.note.trim() !== ''
                                            ? '❌ Đã từ chối'
                                            : '⏳ Chờ duyệt'}
                                </p>
                            </div>
                            {formData.isApproved === false && formData.note && formData.note.trim() !== '' && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Lý do từ chối</label>
                                    <p className="border p-3 rounded-lg bg-gray-50">{formData.note}</p>
                                </div>
                            )}
                            <div className="flex justify-end space-x-3 pt-6">
                                <button
                                    onClick={() => onEdit(job)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    type="button"
                                    onClick={onViewApplications}
                                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                                >
                                    Xem Đơn Ứng Tuyển
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                        placeholder="Nhập tiêu đề công việc"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Địa điểm *</label>
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Chọn địa điểm</option>
                                        {filtersData.find(f => f.key === "Địa điểm")?.list.filter(loc => loc !== "Tất cả").map((loc, index) => (
                                            <option key={index} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Hình thức làm việc *</label>
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Chọn hình thức</option>
                                        {filtersData.find(f => f.key === "Hình thức làm việc")?.list.filter(item => item.name !== "Tất cả").map((item, index) => (
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
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                    />
                                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Lương tối thiểu *</label>
                                    <input
                                        type="number"
                                        name="salaryMin"
                                        value={formData.salaryMin}
                                        onChange={handleChange}
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
                                        value={formData.salaryMax}
                                        onChange={handleChange}
                                        className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                        min="0"
                                    />
                                    {errors.salaryMax && <p className="text-red-500 text-sm mt-1">{errors.salaryMax}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Số năm kinh nghiệm *</label>
                                    <input
                                        type="number"
                                        name="yearsOfExperience"
                                        value={formData.yearsOfExperience}
                                        onChange={handleChange}
                                        className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                        min="0"
                                    />
                                    {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Trình độ học vấn *</label>
                                    <Select
                                        options={educationLevelOptions}
                                        value={educationLevelOptions.find(opt => opt.value === formData.educationLevel)}
                                        onChange={handleEducationLevelChange}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Chọn trình độ học vấn..."
                                    />
                                    {errors.educationLevel && <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>}
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Kỹ năng</label>
                                    <Select
                                        isMulti
                                        options={skillOptions}
                                        value={skillOptions.filter(opt => formData.skillIds.includes(opt.value))}
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
                                        value={categoryOptions.filter(opt => formData.categoryIds.includes(opt.value))}
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
                                        content={formData.description}
                                        onChange={handleEditorChange("description")}
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Yêu cầu *</label>
                                    <TipTapEditor
                                        content={formData.requirements}
                                        onChange={handleEditorChange("requirements")}
                                    />
                                    {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Quyền lợi *</label>
                                    <TipTapEditor
                                        content={formData.benefits}
                                        onChange={handleEditorChange("benefits")}
                                    />
                                    {errors.benefits && <p className="text-red-500 text-sm mt-1">{errors.benefits}</p>}
                                </div>
                                {isEditMode && (
                                    <div className="flex flex-col md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isActive"
                                                    value="true"
                                                    checked={formData.isActive === true}
                                                    onChange={handleRadioChange}
                                                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="ml-2 text-gray-700">Đăng</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isActive"
                                                    value="false"
                                                    checked={formData.isActive === false}
                                                    onChange={handleRadioChange}
                                                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="ml-2 text-gray-700">Ẩn</span>
                                            </label>
                                        </div>
                                        {errors.isActive && <p className="text-red-500 text-sm mt-1">{errors.isActive}</p>}
                                    </div>
                                )}
                            </div>
                            {errors.submit && <p className="text-red-500 text-sm mt-4">{errors.submit}</p>}
                            <div className="flex justify-end mt-6 gap-4">
                                <button
                                    type="button"
                                    onClick={isCreateMode ? onClose : () => setMode('view')}
                                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    {isViewMode ? 'Đóng' : 'Hủy'}
                                </button>
                                {(isEditMode || isCreateMode) && (
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                                    >
                                        Lưu
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobModal;