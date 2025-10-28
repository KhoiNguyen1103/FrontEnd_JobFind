import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faFilter,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  filterJobs,
  resetFilter,
  setJobsRaw,
} from "../../redux/slices/filterJobSlice";
import Pagination from "../../components/ui/Pagination";
import JobItemVertical from "../../components/ui/JobItemVerical";
import jobApi from "../../api/jobApi";

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
      { id: "EX01", name: "1-2" },
      { id: "EX02", name: "2-3" },
      { id: "EX03", name: "3-4" },
      { id: "EX04", name: "4-5" },
      { id: "EX05", name: "5-100" },
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
    id: "WORKTYPE",
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
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const jobsRedux = useSelector((state) => state.jobs.jobs);
  const filterJobsRedux = useSelector((state) => state.filterJob.jobsFiltered);

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [filterSelected, setFilterSelected] = useState(filtersJob[0]);
  const [filterItemSelected, setFilterItemSelected] = useState({
    id: "000",
    name: "Tất cả",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      if (filterJobsRedux.length === 0 || role === "COMPANY") {
        setIsLoading(true);
        try {
          const response = await jobApi.search();
          dispatch(
            setJobsRaw({
              jobs: response,
              context: role === "COMPANY" ? "company" : "jobseeker",
            })
          );
        } catch (err) {
          console.error(`Lỗi lấy jobs cho ${role}:`, err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (role) {
      fetchJobs();
    }
  }, [role, filterJobsRedux.length, dispatch]);

  // Pagination
  const jobsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filterJobsRedux.length / jobsPerPage);
  const currentJobs = filterJobsRedux.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // Toggle filter modal
  const toggleFilterModal = () => setIsOpenFilter(!isOpenFilter);

  const toggleFilter = (filter) => {
    setFilterSelected(filter);
    setFilterItemSelected(filter.options[0]);
    setIsOpenFilter(false);
    dispatch(resetFilter());
  };

  const toggleFilterOption = (option) => {
    setFilterItemSelected(option);
    dispatch(filterJobs({ [filterSelected.id]: option.name }));
  };

  // Đóng modal khi click ngoài vùng filter
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

  // Scroll horizontal filter option
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
        <div className="flex justify-between items-center">
          <h1 className="text-primary text-3xl font-bold">
            {role === "COMPANY" ? "Danh Sách Công Việc" : "Việc Làm Tốt Nhất"}
          </h1>
          <div>
            <p className="pe-4 underline text-sm cursor-pointer hover:no-underline">
              Xem tất cả
            </p>
          </div>
        </div>

        {/* Bộ lọc và danh sách option */}
        <div className="pt-6 flex justify-between">
          {/* Bộ lọc chính */}
          <div className="relative min-w-[200px]" ref={ref}>
            <div
              className="flex justify-between items-center border border-slate-300 rounded-md px-4 py-2 cursor-pointer bg-white"
              onClick={toggleFilterModal}
            >
              <FontAwesomeIcon icon={faFilter} className="pe-4 text-slate-400" />
              <span className="text-slate-400 pe-4">Lọc theo:</span>
              <div className="flex items-center">
                <span className="text-base pe-12 text-slate-600">{filterSelected.name}</span>
                <FontAwesomeIcon icon={faAngleDown} className="text-slate-600" />
              </div>
            </div>
            {isOpenFilter && (
              <div className="absolute top-full right-0 rounded-md bg-white shadow-inner border border-slate-300 py-2 mt-0.5">
                {filtersJob
                  .filter((f) =>
                    ["LOCATION", "EXPERIENCE", "WORKTYPE"].includes(f.id)
                  )
                  .map((filter) => (
                    <div
                      key={filter.id}
                      className="px-2 py-2 cursor-pointer hover:bg-slate-300"
                      onClick={() => toggleFilter(filter)}
                    >
                      <span
                        className={
                          filterSelected.id === filter.id ? "text-primary" : ""
                        }
                      >
                        {filter.name}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Danh sách filter options */}
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faAngleLeft}
              className="btn-circle text-xl me-4"
              onClick={scrollLeft}
            />
            <div
              className="flex items-center space-x-2 overflow-x-auto scroll-smooth"
              style={{
                whiteSpace: "nowrap",
                maxWidth: "700px",
                scrollbarWidth: "none",
              }}
              ref={listFilterRef}
            >
              {filterSelected.options.map((option) => (
                <div
                  key={option.id}
                  className={`rounded-full py-2 px-4 mx-1 cursor-pointer border-base ${filterItemSelected.id === option.id
                    ? "bg-primary text-white"
                    : "bg-slate-200"
                    }`}
                  onClick={() => toggleFilterOption(option)}
                >
                  <span className="text-sm">
                    {filterSelected.id === "EXPERIENCE"
                      ? option.name === "5-100"
                        ? "Trên 5 năm"
                        : option.name === "Tất cả"
                          ? "Tất cả"
                          : option.name + " năm"
                      : option.name}
                  </span>
                </div>
              ))}
            </div>
            <FontAwesomeIcon
              icon={faAngleRight}
              className="ms-4 btn-circle text-xl"
              onClick={scrollRight}
            />
          </div>
        </div>

        {/* Danh sách job */}
        <div
          className={
            currentJobs.length > 0
              ? "pt-6 grid grid-cols-3 gap-4 grid-rows-2"
              : ""
          }
        >
          {isLoading ? (
            <p className="text-center text-2xl text-slate-400 py-6">
              Đang tải...
            </p>
          ) : currentJobs.length > 0 ? (
            currentJobs.map((job, index) => (
              <JobItemVertical key={job.jobId || index} job={job} />
            ))
          ) : (
            <p className="text-center text-2xl text-slate-400 py-6">
              Không tìm thấy job nào
            </p>
          )}
        </div>

        {/* Phân trang */}
        <div className="flex justify-center items-center pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default BestJob;