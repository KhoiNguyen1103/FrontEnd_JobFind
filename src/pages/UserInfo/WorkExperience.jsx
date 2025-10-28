import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import skillApi from "../../api/skillApi";
import jobCategoryApi from "../../api/jobCategoryApi";
import jobApi from "../../api/jobApi";
import companyApi from "../../api/companyApi";

const WorkExperience = ({
  isEditMode,
  workExperiences,
  skillMap,
  categoryMap,
  onAddWorkExperience,
  onUpdateWorkExperience,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    jobPositionId: null,
    companyId: null,
    description: "",
    jobType: "",
    startDate: "",
    endDate: "",
    skills: [], 
    categories: [], 
  });

  const [skillOptions, setSkillOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [jobPositionOptions, setJobPositionOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingOptions(true);
        const [skillsRes, categoriesRes, positionsRes, companiesRes] =
          await Promise.all([
            skillApi.getAll(),
            jobCategoryApi.getAll(),
            jobApi.getPosition(),
            companyApi.getAll(),
          ]);
        const skillOptions = skillsRes.map((s) => ({ value: s.skillId, label: s.name }));
        const categoryOptions = categoriesRes.map((c) => ({ value: c.jobCategoryId, label: c.name }));
        const jobPositionOptions = positionsRes.map((p) => ({ value: p.jobPositionId, label: p.name }));
        const companyOptions = companiesRes.map((c) => ({
          value: c.companyId,
          label: c.companyName,
          logo: c.logoPath,
        }));
        setSkillOptions(skillOptions);
        setCategoryOptions(categoryOptions);
        setJobPositionOptions(jobPositionOptions);
        setCompanyOptions(companyOptions);
        console.log("API Responses:", {
          skills: skillsRes,
          categories: categoriesRes,
          positions: positionsRes,
          companies: companiesRes,
        });
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu: " + err.message);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("workExperiences:", workExperiences);
    console.log("Options:", {
      jobPositionOptions,
      companyOptions,
      skillOptions,
      categoryOptions,
    });
  }, [workExperiences, jobPositionOptions, companyOptions, skillOptions, categoryOptions]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field) => (selected) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected ? selected.value : null,
    }));
  };

  const handleMultiSelectChange = (field) => (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOptions.map((opt) => opt.value),
    }));
  };

  const validateForm = () => {
    if (!formData.jobPositionId) {
      toast.error("Vui lòng chọn vị trí công việc!");
      return false;
    }
    if (!formData.companyId) {
      toast.error("Vui lòng chọn công ty!");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Mô tả không được để trống!");
      return false;
    }
    if (!formData.jobType) {
      toast.error("Vui lòng chọn loại công việc!");
      return false;
    }
    if (!formData.startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu!");
      return false;
    }
    if (!formData.endDate) {
      toast.error("Vui lòng chọn ngày kết thúc!");
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Ngày bắt đầu phải trước ngày kết thúc!");
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validateForm()) return;

    const jobPosition = jobPositionOptions.find(
      (opt) => opt.value === formData.jobPositionId
    );
    const company = companyOptions.find((opt) => opt.value === formData.companyId);

    const newWorkExp = {
      jobPositionId: formData.jobPositionId,
      jobTitle: jobPosition?.label || "",
      companyId: formData.companyId,
      companyName: company?.label || "",
      logo: company?.logo || "",
      description: formData.description,
      jobType: formData.jobType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      skills: formData.skills.filter((id) => id != null && !isNaN(id)),
      categories: formData.categories.filter((id) => id != null && !isNaN(id)),
    };

    onAddWorkExperience(newWorkExp);

    setFormData({
      jobPositionId: null,
      companyId: null,
      description: "",
      jobType: "",
      startDate: "",
      endDate: "",
      skills: [],
      categories: [],
    });
    setIsAdding(false);
  };

  const handleEdit = (index) => {
    const exp = workExperiences[index];
    setFormData({
      jobPositionId: exp.jobPositionId,
      companyId: exp.companyId,
      description: exp.description || "",
      jobType: exp.jobType || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      skills: exp.skills?.filter((id) => id != null && !isNaN(id)) || [],
      categories: exp.categories?.filter((id) => id != null && !isNaN(id)) || [],
    });
    setEditingIndex(index);
  };

  const handleUpdate = () => {
    const jobPosition = jobPositionOptions.find(
      (opt) => opt.value === formData.jobPositionId
    );
    const company = companyOptions.find((opt) => opt.value === formData.companyId);

    const updatedWorkExp = {
      id: workExperiences[editingIndex].id,
      jobPositionId: formData.jobPositionId,
      jobTitle: jobPosition?.label || "",
      companyId: formData.companyId,
      companyName: company?.label || "",
      logo: company?.logo || "",
      description: formData.description,
      jobType: formData.jobType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      skills: formData.skills.filter((id) => id != null && !isNaN(id)),
      categories: formData.categories.filter((id) => id != null && !isNaN(id)),
    };

    onUpdateWorkExperience(editingIndex, updatedWorkExp);

    setFormData({
      jobPositionId: null,
      companyId: null,
      description: "",
      jobType: "",
      startDate: "",
      endDate: "",
      skills: [],
      categories: [],
    });
    setEditingIndex(null);
  };

  const jobTypeOptions = [
    { value: "FULLTIME", label: "Toàn thời gian" },
    { value: "PARTTIME", label: "Bán thời gian" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "INTERNSHIP", label: "Thực tập" },
  ];

  // Tạo options cho Select khi chỉnh sửa, thêm tùy chọn tên cũ
  const getEditJobPositionOptions = () => {
    if (editingIndex !== null) {
      const exp = workExperiences[editingIndex];
      const currentJobTitle = exp.jobTitle || "Chưa có vị trí";
      const existingOption = jobPositionOptions.find(
        (opt) => opt.value === exp.jobPositionId && opt.label === currentJobTitle
      );
      if (!existingOption && exp.jobTitle) {
        // Thêm tùy chọn tạm thời với jobTitle cũ
        return [
          { value: exp.jobPositionId, label: currentJobTitle },
          ...jobPositionOptions.filter((opt) => opt.value !== exp.jobPositionId),
        ];
      }
    }
    return jobPositionOptions;
  };

  const getEditCompanyOptions = () => {
    if (editingIndex !== null) {
      const exp = workExperiences[editingIndex];
      const currentCompanyName = exp.companyName || "Chưa có công ty";
      const existingOption = companyOptions.find(
        (opt) => opt.value === exp.companyId && opt.label === currentCompanyName
      );
      if (!existingOption && exp.companyName) {
        // Thêm tùy chọn tạm thời với companyName cũ
        return [
          { value: exp.companyId, label: currentCompanyName, logo: exp.logo },
          ...companyOptions.filter((opt) => opt.value !== exp.companyId),
        ];
      }
    }
    return companyOptions;
  };

  const getEditJobTypeOptions = () => {
    if (editingIndex !== null) {
      const exp = workExperiences[editingIndex];
      const currentJobTypeLabel = exp.jobType || "Chưa có loại công việc";
      const existingOption = jobTypeOptions.find(
        (opt) => opt.value === exp.jobType && opt.label === currentJobTypeLabel
      );
      if (!existingOption && exp.jobType) {
        return [
          { value: exp.jobType, label: currentJobTypeLabel },
          ...jobTypeOptions.filter((opt) => opt.value !== exp.jobType),
        ];
      }
    }
    return jobTypeOptions;
  };


  return (
    <div className="relative pl-8">
      {isLoadingOptions ? (
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      ) : (
        workExperiences.map((exp, index) => (
          <div key={exp.id || index} className="relative mb-6">
            <div className="absolute left-[-20px] top-[4px] w-3 h-3 bg-[#111811] rounded-full z-10"></div>
            {index < workExperiences.length - 1 && (
              <div className="absolute left-[-14.5px] top-[16px] bottom-[-24px] w-px bg-gray-300"></div>
            )}

            <div className="flex items-center gap-3 mb-1">
              {exp.logo && (
                <img
                  src={exp.logo}
                  alt={exp.companyName}
                  className="w-14 h-14 object-cover rounded"
                />
              )}
              <div className="flex flex-col">
                <p className="text-[#111811] text-base font-medium leading-normal">
                  {exp.jobTitle || "Chưa có vị trí"}
                </p>
                <p className="text-[#111811] text-sm font-normal leading-normal">
                  {exp.companyName || "Chưa có công ty"}
                </p>
              </div>
            </div>

            <p className="text-[#638863] text-base font-normal leading-normal mt-1 ml-11">
              {exp.startDate} - {exp.endDate}
            </p>
            <p className="text-[#111811] text-base font-normal leading-normal mt-1 ml-11">
              {exp.description || "Chưa có mô tả"}
            </p>
            <div className="flex flex-wrap gap-2 mt-2 ml-11">
              {exp.skills
                ?.filter((id) => id != null && !isNaN(id) && skillMap.has(id))
                .map((skillId, idx) => {
                  const name = skillMap.get(skillId) || `Skill ID: ${skillId}`;
                  return (
                    <span
                      key={`skill-${skillId}-${idx}`}
                      className="bg-[#f0f4f0] text-[#111811] text-sm px-2 py-1 rounded"
                    >
                      {name}
                    </span>
                  );
                })}
              {exp.categories
                ?.filter((id) => id != null && !isNaN(id) && categoryMap.has(id))
                .map((catId, idx) => {
                  const name = categoryMap.get(catId) || `Category ID: ${catId}`;
                  return (
                    <span
                      key={`category-${catId}-${idx}`}
                      className="bg-[#e6f0fa] text-[#111811] text-xs px-2 py-1 rounded"
                    >
                      {name}
                    </span>
                  );
                })}
            </div>

            {isEditMode && (
              <div className="flex gap-2 mt-2 ml-11">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateWorkExperience(index, null)}
                  className="text-red-600 hover:text-red-800"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {isEditMode && (isAdding || editingIndex !== null) && !isLoadingOptions && (
        <div className="bg-white p-4 rounded-lg shadow mt-4">
          <h3 className="text-lg font-medium mb-4">
            {editingIndex !== null ? "Chỉnh sửa kinh nghiệm" : "Thêm kinh nghiệm"}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <Select
              options={getEditJobPositionOptions()}
              value={
                getEditJobPositionOptions().find((opt) => opt.value === formData.jobPositionId) || null
              }
              onChange={handleSelectChange("jobPositionId")}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder={editingIndex !== null ? "Chọn vị trí công việc mới..." : "Chọn vị trí công việc..."}
            />
            <Select
              options={getEditCompanyOptions()}
              value={
                getEditCompanyOptions().find((opt) => opt.value === formData.companyId) || null
              }
              onChange={handleSelectChange("companyId")}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder={editingIndex !== null ? "Chọn công ty mới..." : "Chọn công ty..."}
            />
            <textarea
              value={formData.description}
              onChange={handleInputChange("description")}
              placeholder="Mô tả công việc..."
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Select
              options={getEditJobTypeOptions()}
              value={
                getEditJobTypeOptions().find((opt) => opt.value === formData.jobType) || null
              }
              onChange={handleSelectChange("jobType")}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder={editingIndex !== null ? "Chọn loại công việc mới..." : "Chọn loại công việc..."}
            />

            <input
              type="date"
              value={formData.startDate}
              onChange={handleInputChange("startDate")}
              max={new Date().toISOString().split("T")[0]}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={handleInputChange("endDate")}
              max={new Date().toISOString().split("T")[0]}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Select
              isMulti
              options={skillOptions}
              value={skillOptions.filter((opt) => formData.skills.includes(opt.value))}
              onChange={handleMultiSelectChange("skills")}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Chọn kỹ năng..."
            />
            <Select
              isMulti
              options={categoryOptions}
              value={categoryOptions.filter((opt) => formData.categories.includes(opt.value))}
              onChange={handleMultiSelectChange("categories")}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Chọn danh mục..."
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingIndex !== null ? "Cập nhật" : "Thêm"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingIndex(null);
                  setFormData({
                    jobPositionId: null,
                    companyId: null,
                    description: "",
                    jobType: "",
                    startDate: "",
                    endDate: "",
                    skills: [],
                    categories: [],
                  });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditMode && !isAdding && editingIndex === null && !isLoadingOptions && (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
        >
          Thêm kinh nghiệm
        </button>
      )}
    </div>
  );
};

WorkExperience.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  workExperiences: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      jobPositionId: PropTypes.number.isRequired,
      jobTitle: PropTypes.string,
      companyId: PropTypes.number.isRequired,
      companyName: PropTypes.string,
      logo: PropTypes.string,
      description: PropTypes.string.isRequired,
      jobType: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      skills: PropTypes.arrayOf(PropTypes.number),
      categories: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
  skillMap: PropTypes.instanceOf(Map).isRequired,
  categoryMap: PropTypes.instanceOf(Map).isRequired,
  onAddWorkExperience: PropTypes.func,
  onUpdateWorkExperience: PropTypes.func,
};

export default WorkExperience;