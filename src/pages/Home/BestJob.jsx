import { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faFilter,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
// redux
import { useDispatch } from "react-redux";
import { filterJob } from "../../redux/slices/jobSlice";
// data
import filters from "../../data/filters";
// untils
import {
  convertSalaryDisplay,
  convertExperienceDisplay,
} from "../../untils/convertSalaryDisplay";
// component
// import JobItem from "../../components/ui/JobItem";
import JobItem from "./JobItem";

// api service
import { getAllJobs } from "../../services/getAllJobs";

const BestJob = () => {
  const dispatch = useDispatch();
  // state để lưu danh sách job
  const [jobs, setJobs] = useState([]);
  // state để lưu trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  // số lượng job hiển thị trên 1 trang
  const jobsPerPage = 6;

  // Lấy danh sách job từ api
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Lấy danh sách job phân trang
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Phân trang
  const maxPageCount = Math.ceil(jobs.length / jobsPerPage);

  const increasePagination = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const decreasePagination = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Mở model bộ lọc
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const toggleFilterModal = () => {
    setIsOpenFilter(!isOpenFilter);
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

  // Theo dõi sự thay đổi bộ lọc
  const [filterSelected, setFilterSelected] = useState(filters[0]);
  const toggleFilter = (filter) => {
    setFilterSelected(filter);
    setFilterItemSelected("Tất cả");
    setIsOpenFilter(false);
  };

  // Lọc danh sách job theo filter đã chọn

  // Chọn 1 giá trị của bộ lọc
  const [filterItemSelected, setFilterItemSelected] = useState("Tất cả");
  const toggleFilterItem = (item) => {
    setFilterItemSelected(item);
  };

  // Dùng useEffect để lọc danh sách job khi filterItemSelected thay đổi
  useEffect(() => {
    dispatch(filterJob({ key: filterSelected.key, value: filterItemSelected }));
  }, [filterItemSelected, dispatch, filterSelected.key]);

  // Nếu value của bộ lọc quá nhiều thì cho phép cuộn sang trái phải
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

  // format lại cho đẹp để hiển thị danh sách filter item
  const formatedFilterItems = () => {
    if (filterSelected.key === "Mức lương") {
      return convertSalaryDisplay(filterSelected.list);
    } else if (filterSelected.key === "Kinh nghiệm") {
      return convertExperienceDisplay(filterSelected.list);
    } else {
      return filterSelected.list;
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
          <div className="relative" ref={ref}>
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
              <div
                className="flex justify-between items-center"
                style={{ width: "170px" }}
              >
                <span className="text-base pe-12 text-slate-600">
                  {filterSelected.key}
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
              <div className="absolute top-full right-0 rounded-md bg-white shadow-inner border border-slate-300 w-2/3 py-2 mt-0.5">
                {filters.slice(0, 4).map((filter) => (
                  <div
                    key={filter.key}
                    className="px-2 py-2 cursor-pointer hover:bg-slate-300"
                    onClick={() => toggleFilter(filter)}
                  >
                    <span
                      className={
                        filterSelected.key == filter.key ? "text-primary" : ""
                      }
                    >
                      {filter.key}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* end: menu selector */}
          </div>

          {/* filter item list */}
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
              {formatedFilterItems().map((v, index) => (
                <div
                  key={index}
                  className={`rounded-full py-2 px-4 mx-1 cursor-pointer border-base ${
                    filterItemSelected === v
                      ? "bg-primary text-white"
                      : "bg-slate-200"
                  }`}
                  onClick={() => toggleFilterItem(v)}
                >
                  <span className="text-sm">{v}</span>
                </div>
              ))}
            </div>

            <FontAwesomeIcon
              icon={faAngleRight}
              className="ms-4 btn-circle text-xl"
              onClick={scrollRight}
            />
          </div>
          {/* end: list filter */}
        </div>
        {/* end: filter */}

        {/* start: ============= danh sách công việc ================ */}
        <div
          className={
            currentJobs.length > 0
              ? `pt-6 grid grid-cols-3 gap-4 grid-rows-2 overflow-hidden`
              : ""
          }
        >
          {currentJobs.length !== 0 ? (
            currentJobs.map((job) => <JobItem key={job.jobId} job={job} />)
          ) : (
            <p className="text-center block text-2xl text-slate-400 py-6">
              Không tìm thấy job nào
            </p>
          )}
        </div>
        {/* end: ============= danh sách công việc ================ */}

        {/* start: ============== phân trang =========== */}
        <div
          className="flex justify-between items-center pt-6 mx-auto"
          style={{ width: "200px" }}
        >
          <FontAwesomeIcon
            icon={faAngleLeft}
            className={
              currentPage > 1
                ? "me-4 btn-circle text-xl cursor-pointer"
                : "me-4 btn-circle text-xl opacity-50 cursor-not-allowed"
            }
            onClick={decreasePagination}
          />
          <p>
            <span className="text-primary">{currentPage}</span> /{" "}
            <span className="text-slate-500">{maxPageCount} trang</span>
          </p>
          <FontAwesomeIcon
            icon={faAngleRight}
            className={
              currentPage < maxPageCount
                ? "btn-circle text-xl cursor-pointer"
                : "btn-circle text-xl opacity-50 cursor-not-allowed"
            }
            onClick={increasePagination}
          />
        </div>
      </div>
      {/* end: ============== phân trang =========== */}
    </div>
  );
};

export default BestJob;
