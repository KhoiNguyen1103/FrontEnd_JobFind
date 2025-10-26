import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faLocationDot,
  faMagnifyingGlass,
  faAngleDown,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// image
import background from "../assets/bg_search_section.jpg";

// component
import MenuLocation from "../components/Menu/MenuLocation";
import MenuCategory from "../components/Menu/MenuCategory";
// import MenuIndustry from "../components/Menu/MenuIndustry";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCategories } from "../redux/slices/categorySlice";

const SearchBar = () => {
  const user = useSelector((state) => state.auth.user);
  const auth_role = useSelector((state) => state.auth.user)?.role;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  // Lấy dữ liệu từ redux
  const citysSelected = useSelector((state) => state.locations.citySelected);
  const categoriesSelected = useSelector(
    (state) => state.category.selectedCategories
  );

  // Lấy dữu liệu search Text từ localstorage
  useEffect(() => {
    const savedSearchData = JSON.parse(localStorage.getItem("searchData"));

    if (savedSearchData) {
      setSearchText(savedSearchData.keyword);
      dispatch(setSelectedCategories(savedSearchData.categories));
    }
  }, []);

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

  // ============ Đóng/mở menu categories
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

  const handleButtonSearch = () => {
    const companyId = user.userId;
    const queryParams = new URLSearchParams();

    const hasSearchText = searchText.trim().length > 0;
    const hasCity = citysSelected.length > 0;
    const hasCategory = categoriesSelected.length > 0;

    if (hasSearchText) {
      queryParams.append("keyword", searchText);
    }

    if (hasCity) {
      if (auth_role === "JOBSEEKER") {
        const cities = citysSelected.join(",");
        queryParams.append("location", cities);
      } else {
        citysSelected.forEach((city) => {
          queryParams.append("location", city);
        });
      }
    }

    if (hasCategory && auth_role === "JOBSEEKER") {
      const categoryIds = categoriesSelected
        .map((cat) => cat.jobCategoryId)
        .join(",");
      queryParams.append("categoryIds", categoryIds);
    }

    if (auth_role !== "JOBSEEKER") {
      queryParams.append("companyId", companyId);
    }

    localStorage.setItem("searchText", JSON.stringify(searchText));

    if (auth_role === "JOBSEEKER") {
      navigate(`/search?${queryParams.toString()}`);
      window.location.reload();
    } else {
      console.log("response: ", queryParams.toString());
      navigate(`/search-cv?${queryParams.toString()}`);
    }
  };

  return (
    <div
      className="flex justify-center items-center py-6 px-4 z-50"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative container flex justify-between items-center rounded-full shadow-lg bg-white">
        <div className="relative" ref={refCategory}>
          {/* Label danh mục nghề */}
          <div
            className="ps-4 flex items-center justify-between flex-nowrap bg-slate-200 cursor-pointer py-4 pe-4 rounded-s-full"
            style={{ width: "250px" }}
            onClick={() => setIsOpenCategory(!isOpenCategory)}
          >
            <FontAwesomeIcon icon={faList} />
            <p>Danh mục nghề {"(" + categoriesSelected?.length + ")"}</p>
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          {/* end: label danh mục nghề */}

          {/* Menu danh mục nghề */}
          <div className="absolute top-full left-0 mt-4 bg-white shadow-md rounded-lg">
            {isOpenCategory && <MenuCategory setIsOpen={setIsOpenCategory} />}
          </div>
          {/* end: Menu danh mục nghề */}
        </div>

        {/* Search text input */}
        <div className="flex grow justify-between items-center bg-white rounded-l-full px-4 py-3 w-3/5">
          {/* input nhập */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={
              auth_role == "JOBSEEKER" ? "Nhập công việc..." : "Nhập từ khóa..."
            }
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
        {/* end: Search text input */}

        {/* Phân cách */}
        <div className="border-l h-6 mx-3"></div>

        {/* Chọn địa điểm */}
        <div className="relative w-1/5" ref={ref}>
          {/* label chọn địa điểm */}
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
          onClick={handleButtonSearch}
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
