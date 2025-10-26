import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CVItem from "../../components/ui/CVItem";
import jobSeekerApi from "../../api/jobSeekerApi";
import { useMemo } from "react";
import savedJobSeekerApi from "../../api/savedJobSeekerApi";
import { transformJobSeekerData } from '../../untils/jobSeekerHelpers';

const SearchResultCV = () => {
  const [filters, setFilters] = useState({
    age: "",
    gender: "",
    salary: "",
    industry: "",
    experience: "",
  });
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedJobSeekers, setSavedJobSeekers] = useState([]);
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

  const filteredCVs = cvList;

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Xóa một filter
  const removeFilter = (key) => {
    setFilters({ ...filters, [key]: "" });
  };

  // Xóa tất cả filter
  const clearAllFilters = () => {
    setFilters({
      age: "",
      gender: "",
      salary: "",
      industry: "",
      experience: "",
    });
  };

  return (
    <div className="py-6">
      <div className="container mx-auto flex gap-6">
        {/* Sidebar bộ lọc */}
        <div className="w-1/4 p-4 border rounded-lg shadow bg-white h-fit overflow-hidden">
          <h2 className="text-xl font-bold mb-4">Bộ lọc</h2>
          <div className="overflow-y-auto h-[450px] pr-2 scrollbar-hide">
            {/* Lọc theo tuổi */}
            <div className="mb-4">
              <label className="block text-gray-700">Tuổi</label>
              <input
                type="number"
                name="age"
                value={filters.age}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập tuổi"
              />
            </div>

            {/* Lọc theo giới tính */}
            <div className="mb-4">
              <label className="block text-gray-700">Giới tính</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Tất cả</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            {/* Lọc theo mức lương mong muốn */}
            <div className="mb-4">
              <label className="block text-gray-700">Mức lương mong muốn</label>
              <select
                name="salary"
                value={filters.salary}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Tất cả</option>
                <option value="10-15 triệu">10-15 triệu</option>
                <option value="15-20 triệu">15-20 triệu</option>
                <option value="20-25 triệu">20-25 triệu</option>
              </select>
            </div>

            {/* Lọc theo ngành nghề */}
            <div className="mb-4">
              <label className="block text-gray-700">Ngành nghề</label>
              <select
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Tất cả</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Kế toán">Kế toán</option>
              </select>
            </div>

            {/* Lọc theo số năm kinh nghiệm */}
            <div className="mb-4">
              <label className="block text-gray-700">Số năm kinh nghiệm</label>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Tất cả</option>
                <option value="2 năm">2 năm</option>
                <option value="3 năm">3 năm</option>
                <option value="5 năm">5 năm</option>
              </select>
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
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null; // Bỏ qua filter rỗng
              return (
                <span
                  key={key}
                  className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center"
                >
                  {value}
                  <button
                    className="ml-2 w-5 h-5 flex items-center justify-center rounded-full"
                    onClick={() => removeFilter(key)}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </button>
                </span>
              );
            })}
          </div>

          {/* Danh sách CV */}
          <div className="grid gap-4">
            {filteredCVs.length > 0 ? (
              filteredCVs.map((cv, index) => (
                <CVItem key={index} profile={cv} savedJobSeekers={savedJobSeekers}/>
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
