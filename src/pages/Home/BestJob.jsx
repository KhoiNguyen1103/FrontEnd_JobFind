import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faFilter,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { filterJob } from "../../redux/slices/jobSlice";
import Pagination from "../../components/ui/Pagination";
import JobItemVertical from "../../components/ui/JobItemVerical";

const filtersJob = [
  {
    id: "LOCATION",
    name: "Địa điểm",
    options: [
      { id: "000", name: "Tất cả" },
      { id: "LC01", name: "Hà Nội" },
      { id: "LC02", name: "Hồ Chí Minh" },
      { id: "LC03", name: "Đà Nẵng" },
      { id: "LC04", name: "Cần Thơ" },
      { id: "LC05", name: "Nha Trang" },
    ],
  },
  {
    id: "CATEGORY",
    name: "Ngành nghề",
    options: [
      { id: "000", name: "Tất cả" },
      { id: "CT01", name: "Công nghệ thông tin" },
      { id: "CT02", name: "Kinh doanh" },
      { id: "CT03", name: "Marketing" },
      { id: "CT04", name: "Thiết kế" },
      { id: "CT05", name: "Tài chính" },
    ],
  },
  {
    id: "EXPERIENCE",
    name: "Kinh nghiệm",
    options: [
      { id: "000", name: "Tất cả" },
      { id: "EX01", name: "Thực tập" },
      { id: "EX02", name: "Mới tốt nghiệp" },
      { id: "EX03", name: "1-2 năm" },
      { id: "EX04", name: "3-5 năm" },
      { id: "EX05", name: "Trên 5 năm" },
    ],
  },
  {
    id: "SALARY",
    name: "Mức lương",
    options: [
      { id: "000", name: "Tất cả" },
      { id: "SL01", name: "< 10 triệu" },
      { id: "SL02", name: "10 - 20 triệu" },
      { id: "SL03", name: "20 - 30 triệu" },
      { id: "SL04", name: "> 30 triệu" },
    ],
  },
  {
    id: "WORKE_TYPE",
    name: "Hình thức làm việc",
    options: [
      { id: "000", name: "Tất cả" },
      { id: "WT01", name: "Toàn thời gian" },
      { id: "WT02", name: "Bán thời gian" },
    ],
  },
];

const BestJob = () => {
  const dispatch = useDispatch();
  // state
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [filterSelected, setFilterSelected] = useState(filtersJob[0]);
  const [filterItemSelected, setFilterItemSelected] = useState({
    id: "000",
    name: "Tất cả",
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  // console.log("filter selected: ", filterSelected);
  // console.log("filter selected options: ", filterSelected.options);

  // lấy data từ redux
  const jobsRedux = useSelector((state) => state.jobs.jobs);
  const filterJobsRedux = useSelector((state) => state.jobs.filterJobs);
  const loading = useSelector((state) => state.jobs.loading);

  // Phân trang
  const jobsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filterJobsRedux.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filterJobsRedux.slice(startIndex, endIndex);

  // Handle click
  const toggleFilterModal = () => {
    setIsOpenFilter(!isOpenFilter);
  };

  const toggleFilter = (filter) => {
    setFilterSelected(filter);
    setFilterItemSelected(filter.options[0]);
    setIsOpenFilter(false);
  };

  const toggleFilterOption = (option) => {
    setFilterItemSelected(option);
  };

  // Đóng model bộ lọc khi click bên ngoài
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpenFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Nếu options của filter quá nhiều thì cho phép cuộn sang trái phải
  const listFilterRef = useRef(null);

  const scrollLeft = () => {
    if (listFilterRef.current) {
      listFilterRef.current.scrollLeft -= 100;
    }
  };

  const scrollRight = () => {
    if (listFilterRef.current) {
      listFilterRef.current.scrollLeft += 100;
    }
  };

  return (
    <div className="pt-6 pb-6" style={{ backgroundColor: "#f3f5f7" }}>
      <div className="container mx-auto">
        {/* start: header */}
        <div className="flex justify-between items-center">
          <h1 className="text-primary text-3xl font-bold">Việc làm tốt nhất</h1>
          <div className="flex justify-between items-center">
            <p className="pe-4 underline text-sm cursor-pointer hover:no-underline">
              Xem tất cả
            </p>
          </div>
        </div>
        {/* end: header */}

        {/* start: filter */}
        <div className="pt-6 flex justify-between ">
          <div className="relative min-w-[200px]" ref={ref}>
            {/* label filter selector */}
            <div
              className="flex justify-between items-center 
              border border-slate-300 rounded-md px-4 py-2 cursor-pointer bg-white"
              onClick={toggleFilterModal}
            >
              <FontAwesomeIcon
                icon={faFilter}
                className="pe-4 text-slate-400"
              />
              <span className="text-slate-400 pe-4">Lọc theo:</span>
              <div className="flex justify-between items-center">
                <span className="text-base pe-12 text-slate-600">
                  {filterSelected.name}
                </span>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className="text-slate-600"
                />
              </div>
            </div>
            {/* end: label filter selector */}

            {/* menu filter selector */}
            {isOpenFilter && (
              <div className="absolute top-full right-0 rounded-md bg-white shadow-inner border border-slate-300 py-2 mt-0.5">
                {filtersJob.map((filter) => (
                  <div
                    key={filter.id}
                    className="px-2 py-2 cursor-pointer hover:bg-slate-300"
                    onClick={() => toggleFilter(filter)}
                  >
                    <span
                      className={
                        filterSelected.id == filter.id ? "text-primary" : ""
                      }
                    >
                      {filter.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* end: menu selector */}
          </div>

          {/* start: filter options list */}
          <div className="flex justify-between items-center">
            <FontAwesomeIcon
              icon={faAngleLeft}
              className="btn-circle text-xl me-4"
              onClick={scrollLeft}
            />

            <div
              className="flex items-center space-x-2 overflow-hidden overflow-x-auto scroll-smooth"
              style={{
                whiteSpace: "nowrap",
                maxWidth: "700px",
                scrollbarWidth: "none",
              }}
              ref={listFilterRef}
            >
              {filterSelected.options.map((filterOption) => (
                <div
                  key={filterOption.id}
                  className={`rounded-full py-2 px-4 mx-1 cursor-pointer border-base ${
                    filterItemSelected.id === filterOption.id
                      ? "bg-primary text-white"
                      : "bg-slate-200"
                  }`}
                  onClick={() => toggleFilterOption(filterOption)}
                >
                  <span className="text-sm">{filterOption.name}</span>
                </div>
              ))}
            </div>

            <FontAwesomeIcon
              icon={faAngleRight}
              className="ms-4 btn-circle text-xl"
              onClick={scrollRight}
            />
          </div>
          {/* end: filter options list */}
        </div>
        {/* end: filter */}

        {/* start: jobs list */}
        <div
          className={
            currentJobs.length > 0
              ? `pt-6 grid grid-cols-3 gap-4 grid-rows-2 overflow-hidden`
              : ""
          }
        >
          {!loading ? (
            currentJobs.map((job, index) => (
              <JobItemVertical key={job.jobId || index} job={job} />
            ))
          ) : (
            <p className="text-center block text-2xl text-slate-400 py-6">
              Không tìm thấy job nào
            </p>
          )}
        </div>
        {/* end: jobs list */}

        {/* start: phân trang */}
        <div className="flex justify-center items-center pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        {/* end: phân trang */}
      </div>
    </div>
  );
};

export default BestJob;
