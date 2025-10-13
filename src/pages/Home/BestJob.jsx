import { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faFilter,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

import JobItem from "../../components/ui/JobItem";
import { useSelector } from "react-redux";

const filters = [
  {
    key: "Địa điểm",
    list: ["Tất cả", "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng"],
  },
  {
    key: "Mức lương",
    list: [
      "Tất cả",
      "Dưới 5 triệu",
      "5 - 10 triệu",
      "10 - 20 triệu",
      "Trên 20 triệu",
    ],
  },
  {
    key: "Kinh nghiệm",
    list: [
      "Tất cả",
      "Chưa có kinh nghiệm",
      "Dưới 1 năm",
      "1 - 2 năm",
      "Trên 2 năm",
    ],
  },
  {
    key: "Ngành nghề",
    list: [
      "Tất cả",
      "IT - Phần mềm",
      "IT - Phần cứng",
      "Kinh doanh",
      "Marketing",
      "IT ",
      " Phần cứng",
      "K doanh",
      "Mketing",
      "Dev java",
      " Python",
      "React",
      "Mobile",
    ],
  },
];

const BestJob = () => {
  // open filter modal
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const toggleFilterModal = () => {
    setIsOpenFilter(!isOpenFilter);
  };

  // close filter modal when click outside
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

  // track filter selected
  const [filterSelected, setFilterSelected] = useState(filters[0]);
  const toggleFilter = (filter) => {
    setFilterSelected(filter);
    setIsOpenFilter(false);
  };

  // scroll list filter
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

  // Chọn 1 filter item
  const [filterItemSelected, setFilterItemSelected] = useState(null);
  const toggleFilterItem = (item) => {
    setFilterItemSelected(item);
  };

  // Lọc danh sách job theo filter đã chọn

  // get job list
  const jobs = useSelector((state) => state.jobs.jobs);

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
            <div className="">
              <FontAwesomeIcon
                icon={faAngleLeft}
                className="me-4 btn-circle text-xl"
              />
              <FontAwesomeIcon
                icon={faAngleRight}
                className="btn-circle text-xl"
              />
            </div>
          </div>
        </div>
        {/* end: header */}

        {/* start: filter */}
        <div className="pt-6 flex justify-between ">
          <div className="relative" ref={ref}>
            {/* filter selector */}
            <div
              className="flex justify-between items-center border border-slate-300 rounded-md px-4 py-2 cursor-pointer"
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
            {/* end: filter selector */}

            {/* model filter selector */}
            {isOpenFilter && (
              <div className="absolute top-full right-0 rounded-md bg-white shadow-inner border border-slate-300 w-2/3 py-2 mt-0.5">
                {filters.map((filter) => (
                  <div
                    key={filter.key}
                    className="px-2 py-2 cursor-pointer hover:bg-slate-300"
                    onClick={() => toggleFilter(filter)}
                  >
                    <span
                      className={
                        filterSelected.key == filter.key && "text-primary"
                      }
                    >
                      {filter.key}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* end: model selector */}
          </div>

          {/* filter item */}
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
              {filterSelected.list.map((v, index) => (
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

        {/* start: list job */}
        <div className="pt-6 grid grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobItem key={job.id} job={job} />
          ))}
        </div>
        {/* end: list job */}

        {/* pagination */}
        <div
          className="flex justify-between items-center pt-6 mx-auto"
          style={{ width: "200px" }}
        >
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="me-4 btn-circle text-xl"
          />
          <p>
            <span className="text-primary">4</span> /{" "}
            <span className="text-slate-500">84 trang</span>
          </p>
          <FontAwesomeIcon icon={faAngleRight} className="btn-circle text-xl" />
        </div>
      </div>
    </div>
  );
};

export default BestJob;
