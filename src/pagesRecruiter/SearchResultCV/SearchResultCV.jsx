import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CVItem from "../../components/ui/CVItem";
import jobSeekerApi from "../../api/jobSeekerApi";
import savedJobSeekerApi from "../../api/savedJobSeekerApi";
import skillApi from "../../api/skillApi";
import { transformJobSeekerData } from "../../untils/jobSeekerHelpers";
import Select from "react-select";

const SearchResultCV = () => {
  const [filters, setFilters] = useState({
    birthYearRange: "",
    experienceRange: "",
    skillIds: [],
  });
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedJobSeekers, setSavedJobSeekers] = useState([]);
  const [skills, setSkills] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";
  const locationList = queryParams.getAll("location");
  const categoryIds = useMemo(() => {
    const raw = queryParams.get("categoryIds");
    return raw ? raw.split(",") : [];
  }, [location.search]);
  const companyId = queryParams.get("companyId") || "";

  // Lấy danh sách kỹ năng
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await skillApi.getAll();
        setSkills(res);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  // Lấy danh sách CV và ứng viên đã lưu
  useEffect(() => {
    const fetchJobSeekers = async () => {
      setLoading(true);
      try {
        const response = await jobSeekerApi.searchJobSeekers(keyword, categoryIds, locationList, companyId);
        const responseSavedJobseeker = await savedJobSeekerApi.getListSaved(companyId);

        const transformedData = transformJobSeekerData(response);
        setCvList(transformedData);
        const savedIds = responseSavedJobseeker.filter(seeker => seeker.profileId).map(seeker => seeker.profileId);
        setSavedJobSeekers(savedIds);
      } catch (err) {
        setError("Failed to fetch CVs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobSeekers();
  }, [location.search]);

  // Tùy chọn kỹ năng cho Select
  const skillOptions = skills.slice(0, 10).map(skill => ({
    value: skill.skillId,
    label: skill.name,
  }));

  // Tùy chọn range năm sinh (10 năm một khoảng, dưới 60 tuổi)
  const birthYearOptions = useMemo(() => {
    const currentYear = 2025;
    const maxYear = currentYear - 18;
    const minYear = 1965; 
    const options = [];
    for (let start = maxYear - 10; start >= minYear; start -= 10) {
      options.push({
        value: `${start}-${start + 9}`,
        label: `${start} - ${start + 9}`,
        min: start,
        max: start + 9,
      });
    }
    return options;
  }, []);

  // Tùy chọn range năm kinh nghiệm
  const experienceOptions = [
    { value: "0-1", label: "Dưới 1 năm", min: 0, max: 1 },
    { value: "1-3", label: "1 - 3 năm", min: 1, max: 3 },
    { value: "3-5", label: "3 - 5 năm", min: 3, max: 5 },
    { value: "5-10", label: "5 - 10 năm", min: 5, max: 10 },
    { value: "10-15", label: "10 - 15 năm", min: 10, max: 15 },
    { value: "15-20", label: "15 - 20 năm", min: 15, max: 20 },
    { value: "20+", label: "Trên 20 năm", min: 20, max: Infinity },
  ];

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  // Xử lý thay đổi kỹ năng (multi-select)
  const handleMultiSelectChange = (name) => (selectedValues) => {
    setFilters({ ...filters, [name]: selectedValues });
  };

  // Xóa một filter
  const removeFilter = (key) => {
    setFilters({ ...filters, [key]: key === "skillIds" ? [] : "" });
  };

  // Xóa tất cả filter
  const clearAllFilters = () => {
    setFilters({
      birthYearRange: "",
      experienceRange: "",
      skillIds: [],
    });
  };

  // Lọc CV dựa trên bộ lọc
  const filteredCVs = cvList.filter(cv => {
    const birthYear = new Date(cv.birthDay).getFullYear();
    const experience = cv.workExperiences || 0;
    const cvSkillIds = cv.skills?.map(s => {
      const matchedSkill = skills.find(sk => sk.name === s.name);
      return matchedSkill?.skillId;
    }) || [];

    // Lọc năm sinh
    const selectedBirthYear = birthYearOptions.find(opt => opt.value === filters.birthYearRange);
    const birthYearPass = !filters.birthYearRange || (
      birthYear >= selectedBirthYear?.min &&
      birthYear <= selectedBirthYear?.max
    );

    // Lọc kinh nghiệm
    const selectedExperience = experienceOptions.find(opt => opt.value === filters.experienceRange);
    const experiencePass = !filters.experienceRange || (
      experience >= selectedExperience?.min &&
      experience < selectedExperience?.max
    );

    // Lọc kỹ năng
    const skillsPass =
      filters.skillIds.length === 0 ||
      filters.skillIds.every(id => cvSkillIds.includes(id));

    return birthYearPass && experiencePass && skillsPass;
  });

  return (
    <div className="py-6">
      <div className="container mx-auto flex gap-6">
        {/* Sidebar bộ lọc */}
        <div className="w-1/4 p-4 border rounded-lg shadow bg-white h-fit overflow-hidden">
          <h2 className="text-xl font-bold mb-4">Bộ lọc</h2>
          <div className="overflow-y-auto h-[450px] pr-2 scrollbar-hide">
            {/* Lọc theo range năm sinh */}
            <div className="mb-4">
              <label className="block text-gray-700">Năm sinh</label>
              <select
                name="birthYearRange"
                value={filters.birthYearRange}
                onChange={(e) => handleFilterChange("birthYearRange", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Tất cả</option>
                {birthYearOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc theo range năm kinh nghiệm */}
            <div className="mb-4">
              <label className="block text-gray-700">Số năm kinh nghiệm</label>
              <select
                name="experienceRange"
                value={filters.experienceRange}
                onChange={(e) => handleFilterChange("experienceRange", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Tất cả</option>
                {experienceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc theo kỹ năng */}
            <div className="mb-4">
              <label className="block text-gray-700">Kỹ năng</label>
              <Select
                isMulti
                options={skillOptions}
                value={skillOptions.filter(opt => filters.skillIds.includes(opt.value))}
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

            {/* Nút xóa tất cả filter */}
            <button
              onClick={clearAllFilters}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        </div>

        {/* Danh sách CV */}
        <div className="w-3/4">
          <h2 className="text-xl font-bold mb-4">Danh sách CV</h2>

          {/* Hiển thị tag filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.birthYearRange && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
                Năm sinh: {birthYearOptions.find(opt => opt.value === filters.birthYearRange)?.label}
                <button
                  className="ml-2 w-5 h-5 flex items-center justify-center rounded-full"
                  onClick={() => removeFilter("birthYearRange")}
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </span>
            )}
            {filters.experienceRange && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
                Kinh nghiệm: {experienceOptions.find(opt => opt.value === filters.experienceRange)?.label}
                <button
                  className="ml-2 w-5 h-5 flex items-center justify-center rounded-full"
                  onClick={() => removeFilter("experienceRange")}
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </span>
            )}
            {filters.skillIds.length > 0 && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
                Kỹ năng: {filters.skillIds.map(id => skills.find(s => s.skillId === id)?.name).filter(Boolean).join(", ")}
                <button
                  className="ml-2 w-5 h-5 flex items-center justify-center rounded-full"
                  onClick={() => removeFilter("skillIds")}
                  spout              >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </span>
            )}
          </div>

          {/* Danh sách CV */}
          <div className="grid grid-cols-3 gap-4">
            {filteredCVs.length > 0 ? (
              filteredCVs.map((cv, index) => (
                <CVItem key={index} profile={cv} savedJobSeekers={savedJobSeekers} />
              ))
            ) : (
              <p className="text-gray-500">Không tìm thấy CV phù hợp</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCV;