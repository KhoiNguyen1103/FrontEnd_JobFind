import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchJobs } from "../../redux/slices/searchJobSlice";
import JobItemv2 from "../../components/ui/JobItemv2";
import { filterJobs } from "../../untils/filterJobs";

const filters = [
  {
    id: "DATE",
    name: "Ngày đăng",
    options: [
      "Tất cả ngày đăng",
      "Mới nhất",
      "Cũ nhất",
      "Hạn nộp gần nhất",
      "Hạn nộp xa nhất",
    ],
  },
  {
    id: "WORK_TYPE",
    name: "Hình thức",
    options: ["Tất cả", "Toàn thời gian", "Bán thời gian"],
  },
  {
    id: "SALARY",
    name: "Lương",
    options: [
      "Tất cả",
      "Dưới 5 triệu",
      "5 triệu - 10 triệu",
      "10 triệu - 15 triệu",
      "15 triệu - 20 triệu",
      "Trên 20 triệu",
    ],
  },
  {
    id: "EXPERIENCE",
    name: "Kinh nghiệm",
    options: [
      "Tất cả",
      "Dưới 1 năm",
      "1 năm",
      "2 năm",
      "3 năm",
      "4 năm",
      "5 năm",
      "Trên 5 năm",
    ],
  },
];

const SearchResult = () => {
  const dispatch = useDispatch();

  const [jobs, setJobs] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    LOCATION: "Tất cả địa điểm",
    DATE: "Tất cả ngày đăng",
    WORK_TYPE: "Tất cả",
    SALARY: "Tất cả",
    EXPERIENCE: "Tất cả",
  });

  // Lấy dữ liệu từ url
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";
  const locationParam = queryParams.get("location") || "";
  const jobCategoryId = queryParams.get("jobCategoryId") || "";
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  // fetch data search result
  useEffect(() => {
    // Xử lý dữ liệu
    const keyWordTrimed = keyword.trim();
    const locationsArray = locationParam
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l !== "");
    const jobCategoryIdsArray = jobCategoryId
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    dispatch(
      searchJobs({
        keyword: keyWordTrimed,
        locations: locationsArray,
        jobCategoryIds: jobCategoryIdsArray,
      })
    );
  }, [keyword, locationParam, jobCategoryId, dispatch]);

  // load data từ redux
  const loading = useSelector((state) => state.searchJob.loading);
  const searchJobResults = useSelector((state) => state.searchJob.results);

  useEffect(() => {
    if (searchJobResults && searchJobResults.length > 0) {
      setJobs(searchJobResults);
    }
  }, [searchJobResults]);

  // Lọc dữ liệu
  const handleChange = (filterId, value) => {
    const updatedFilters = { ...selectedFilters, [filterId]: value };
    setSelectedFilters(updatedFilters);
    const filteredJobs = filterJobs(searchJobResults, updatedFilters);
    setJobs(filteredJobs);
  };

  // Đặt lại bộ lọc
  const handleResetFilterJob = () => {
    setJobs(searchJobResults);
    setSelectedFilters({
      LOCATION: "Tất cả địa điểm",
      DATE: "Tất cả ngày đăng",
      WORK_TYPE: "Tất cả",
      SALARY: "Tất cả",
      EXPERIENCE: "Tất cả",
    });
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between">
        {/* Filter Side Bar */}
        <div className="w-1/4">
          <div className="space-y-4 pe-4">
            {filters.map((filter) => (
              <div key={filter.id}>
                <label className="block text-primary font-bold mb-1">
                  {filter.name}
                </label>
                <select
                  value={selectedFilters[filter.id]}
                  onChange={(e) => handleChange(filter.id, e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  {filter.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div
            className="flex justify-between mt-4 pe-4"
            onClick={handleResetFilterJob}
          >
            <button className="py-2 bg-green-500 rounded-lg w-full text-white hover:bg-green-600">
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
        {/* end: filter side bar */}

        {/* List Job */}
        <div className="w-3/4">
          {loading ? (
            <p>Đang tải dữ liệu công việc...</p>
          ) : jobs.length > 0 ? (
            <div>
              <p className="text-2xl py-3">{jobs.length} công việc hiện có</p>

              {jobs.map((job) => (
                <JobItemv2 job={job} key={job.jobId} isApply={false} />
              ))}
            </div>
          ) : (
            <p>Không có công việc nào phù hợp.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
