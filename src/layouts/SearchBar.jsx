import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faLocationDot,
  faMagnifyingGlass,
  faAngleDown,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

// image
import background from "../assets/bg_search_section.jpg";

// component
import MenuLocation from "../components/Menu/MenuLocation";
import MenuCategory from "../components/Menu/MenuCategory";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCategories } from "../redux/slices/categorySlice";

const SearchBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // load data từ redux
  const user = useSelector((state) => state.auth.user);
  const auth_role = user?.role;
  const citysSelected = useSelector((state) => state.location.citySelected);
  const categoriesSelected = useSelector(
    (state) => state.category.selectedCategories
  );

  // state
  const ref = useRef(null);
  const refCategory = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);

  // Lấy dữ liệu search Text từ localStorage
  useEffect(() => {
    const savedSearchData = JSON.parse(localStorage.getItem("searchData"));
    if (savedSearchData) {
      setSearchText(savedSearchData.keyword);
      dispatch(setSelectedCategories(savedSearchData.categories));
    }
  }, [dispatch]);

  // Đóng menu location khi click bên ngoài
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

  // Đóng menu categories khi click bên ngoài
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
    const jobMarketPaths = ["/", "/search", "/company"];
    const isJobMarket = jobMarketPaths.includes(location.pathname);
    const companyId = user ? user.userId : "";
    const queryParams = new URLSearchParams();

    const hasSearchText = searchText.trim().length > 0;
    const hasCity = citysSelected.length > 0;
    const hasCategory = categoriesSelected.length > 0;

    if (hasSearchText) {
      queryParams.append("keyword", searchText);
    }

    if (hasCity) {
      const cities = citysSelected.join(",");
      queryParams.append("location", cities);
    }

    // Logic cho COMPANY
    if (auth_role === "COMPANY") {
      if (isJobMarket) {
        // Ở job market => tìm kiếm job
        if (hasCategory) {
          const categoryIds = categoriesSelected
            .map((cat) => cat.jobCategoryId)
            .join(",");
          queryParams.append("jobCategoryId", categoryIds);
        }
        localStorage.setItem(
          "searchData",
          JSON.stringify({
            keyword: searchText,
            categories: categoriesSelected,
          })
        );
        navigate(`/search?${queryParams.toString()}`);
      } else {
        // Không ở job market => tìm kiếm CV
        queryParams.append("companyId", companyId);
        localStorage.setItem(
          "searchData",
          JSON.stringify({ keyword: searchText, categories: [] })
        );
        navigate(`/search-cv?${queryParams.toString()}`);
      }
      return;
    }

    // Logic cho JOBSEEKER hoặc không đăng nhập
    if (hasCategory) {
      const categoryIds = categoriesSelected
        .map((cat) => cat.jobCategoryId)
        .join(",");
      queryParams.append("jobCategoryId", categoryIds);
    }

    localStorage.setItem(
      "searchData",
      JSON.stringify({ keyword: searchText, categories: categoriesSelected })
    );
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <div
      className="flex flex-col md:flex-row justify-center items-center py-6 px-4 z-50"
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
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={
              auth_role === "COMPANY" &&
              !["/", "/search", "/company"].includes(location.pathname)
                ? "Tìm kiếm CV..."
                : "Nhập công việc..."
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
                {citysSelected.length === 0
                  ? "Địa điểm"
                  : citysSelected[0] +
                    (citysSelected.length > 1
                      ? ` (+${citysSelected.length - 1})`
                      : "")}
              </span>
            </div>
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
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
    </div>
  );
};

export default SearchBar;
