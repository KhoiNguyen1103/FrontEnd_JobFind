// https://www.topcv.vn/?ref=you
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faLocationDot,
  faMagnifyingGlass,
  faAngleDown,
  faList,
} from "@fortawesome/free-solid-svg-icons";

import background from "../assets/bg_search_section.jpg";
import MenuLocation from "../components/ui/MenuLocation";
import MenuCategory from "../components/ui/MenuCategory";
import { useSelector } from "react-redux";

const SearchBar = () => {
  const citysSelected = useSelector((state) => state.locations.citySelected);

  // track search text
  const [searchText, setSearchText] = useState("kế toán");

  // Mở/Tắt model chọn tỉnh thành quận huyện
  const [isOpen, setIsOpen] = useState(false);

  // Đóng model chọn location khi click bên ngoài
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đóng/mở menu categories
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const refCategory = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refCategory.current && !refCategory.current.contains(event.target)) {
        setIsOpenCategory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex justify-center items-center py-6 px-4 z-50"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="relative container flex justify-between items-center rounded-full shadow-lg bg-white"
        ref={refCategory}
      >
        {/* Danh mục nghề */}
        <div
          className="relative"
          onClick={() => setIsOpenCategory(!isOpenCategory)}
        >
          {/* Label danh mục nghề */}
          <div
            className="ps-4 flex items-center justify-between flex-nowrap me-4 bg-slate-200 cursor-pointer py-4 pe-4 rounded-s-full"
            style={{ width: "250px" }}
          >
            <FontAwesomeIcon icon={faList} />
            <p>Danh mục nghề</p>
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          {/* end: label danh mục nghề */}
        </div>
        {/* end: danh mục nghề */}

        {/* Menu danh mục nghề */}
        <div className="w-1/2 absolute top-full left-0 mt-4 bg-white shadow-md rounded-lg">
          {isOpenCategory && <MenuCategory />}
        </div>
        {/* end: Menu danh mục nghề */}

        {/* Ô nhập công việc */}
        <div className="flex grow justify-between items-center bg-white rounded-l-full px-4 py-3 w-3/5">
          {/* input nhập */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Nhập công việc..."
            className="w-full text-gray-800 outline-none p-1"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="text-gray-400"
            >
              <FontAwesomeIcon icon={faCircleXmark} className="text-2xl" />
            </button>
          )}
        </div>
        {/* end: ô nhập công việc */}

        {/* Phân cách */}
        <div className="border-l h-6 mx-3"></div>

        {/* Chọn địa điểm */}
        <div className="relative w-1/5" ref={ref}>
          {/* label chọn đại điểm */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between text-gray-600 cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-xl flex-none"
              />
              <span className="ml-2 flex-none">
                {citysSelected.length == 0
                  ? "Địa điểm"
                  : citysSelected[0] + " (+" + citysSelected.length + ")"}
              </span>
            </div>
            {/* Biểu tượng mũi tên */}
            <FontAwesomeIcon icon={faAngleDown} className="" />
          </div>
          {/* end: label chọn địa điểm */}

          {/* Submenu chọn địa điểm */}
          {isOpen && (
            <div className="absolute top-10 right-0">
              <MenuLocation setIsOpen={setIsOpen} />
            </div>
          )}
        </div>
        {/* end: Chọn địa điểm */}

        {/* Phân cách */}
        <div className="border-l h-6 mx-3"></div>

        {/* Nút tìm kiếm */}
        <button
          className="btn-search text-white flex items-center justify-center py-2 rounded-full me-3"
          style={{ width: "10%" }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="pe-2" />
          Tìm kiếm
        </button>
      </div>
      {/* End: Search section */}
    </div>
  );
};

export default SearchBar;
