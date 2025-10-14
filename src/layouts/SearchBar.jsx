// https://www.topcv.vn/?ref=you
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faLocationDot,
  faMagnifyingGlass,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

import background from "../assets/bg_search_section.jpg";

// redux toolkit
import { useSelector, useDispatch } from "react-redux";
import {
  searchLocation,
  selectSearchLocations,
} from "../redux/slices/locationsSlice";

const SearchBar = () => {
  // track search text
  const [searchText, setSearchText] = useState("kế toán");

  // track list city selected + current city selected
  const dispatch = useDispatch();
  const locations = useSelector(selectSearchLocations);
  // Tìm kiếm theo tên thành phố
  const [searchCityText, setSearchCityText] = useState("");
  // Theo dõi sự thay đổi trong ô input
  const changeSearchCityText = (e) => {
    const text = e.target.value;
    setSearchCityText(text);
    dispatch(searchLocation(text));
  };

  // Lưu các thành phố đang được chọn
  const [citysSelected, setCitysSelected] = useState([]);
  // Lưu thành phố đang focus hiện tại để hiện danh sách quận huyện ra
  const [citySelectedCurrent, setCitySelectedCurrent] = useState();
  // Lưu các quận huyện đang được chọn
  const [districtsSelected, setDistrictsSelected] = useState([]);
  // Hàm thực hiện lưu quận huyện vào mảng districtsSelected
  const toggleDistrict = (district) => {
    if (districtsSelected.includes(district)) {
      setDistrictsSelected(districtsSelected.filter((d) => d !== district));
    } else {
      setDistrictsSelected([...districtsSelected, district]);
    }
  };
  // Hàm thực hiện lưu tỉnh thành vào mảng citysSelected
  const toggleCitys = (city) => {
    if (citysSelected.includes(city.name)) {
      // Nếu city đã có trong danh sách thì bỏ ra
      setCitysSelected(citysSelected.filter((c) => c !== city.name));
      setDistrictsSelected(
        districtsSelected.filter((d) => !city.districts.includes(d))
      );
    } else {
      // Nếu city chưa có trong DS thì thêm vào
      setCitysSelected([...citysSelected, city.name]);
      setDistrictsSelected([...districtsSelected, ...city.districts]);
    }

    setCitySelectedCurrent(city);
  };

  // Unchecked tất cả ô chọn trong model địa điểm
  const uncheckAll = () => {
    setCitysSelected([]);
    setDistrictsSelected([]);
    setCitySelectedCurrent(null);
  };

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

  return (
    <div
      className="flex justify-center items-center py-6 px-4 z-0"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container flex justify-between items-center rounded-full shadow-lg bg-white">
        {/* Ô nhập công việc */}
        <div className="flex grow justify-between items-center bg-white rounded-l-full px-4 py-4 w-3/5">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Nhập công việc..."
            className="w-full text-gray-800 outline-none"
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

        {/* Phân cách */}
        <div className="border-l h-6 mx-3"></div>

        {/* Chọn địa điểm */}
        <div className="relative w-1/5">
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
                  : citysSelected[0] + " +(" + citysSelected.length + ")"}
              </span>
            </div>
            {/* Biểu tượng mũi tên */}
            <FontAwesomeIcon icon={faAngleDown} className="" />
          </div>

          {/* Submenu chọn địa điểm */}
          {isOpen && (
            <div
              className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg z-50"
              ref={ref}
            >
              <div className="flex justify-between px-4 pt-4 w-full">
                {/* city selector */}
                <div className="city pe-4">
                  {/* search name city */}
                  <div className="flex justify-between items-center mb-4 rounded-full border border-slate-300 overflow-hidden">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="px-2 text-xl"
                    />
                    <input
                      type="text"
                      className="py-2 outline-none"
                      placeholder="Nhập tỉnh/thành phố"
                      value={searchCityText}
                      onChange={changeSearchCityText}
                    />
                  </div>

                  {/* Danh sách tỉnh/thành phố */}
                  <div className="max-h-40 overflow-y-auto">
                    {locations.map((city) => (
                      <label
                        key={city.name}
                        className="flex items-center space-x-2 mb-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={citysSelected.includes(city.name)}
                          onChange={() => toggleCitys(city)}
                          className="text-xl"
                          style={{ width: "0.8em", height: "0.8em" }}
                        />
                        <span>{city.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Danh sách quận huyện của tỉnh/thành đang được chọn */}
                <div className="district left-0 mt-2 w-64">
                  <h3 className="font-semibold mb-2">Chọn Quận/Huyện</h3>

                  {/* list district */}
                  {citySelectedCurrent && (
                    <div className="max-h-40 overflow-y-auto">
                      {citySelectedCurrent.districts.map((district) => (
                        <label
                          key={district}
                          className="flex items-center space-x-2 mb-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="text-xl"
                            checked={districtsSelected.includes(district)}
                            onChange={() => toggleDistrict(district)}
                            style={{ width: "0.8em", height: "0.8em" }}
                          />
                          <span>{district}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* footer location selector */}
              <div className="flex justify-between shadow-inner p-4">
                <button className="text-slate-400" onClick={() => uncheckAll()}>
                  Bỏ chọn tất cả
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  Áp dụng
                </button>
              </div>
            </div>
          )}
        </div>

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
