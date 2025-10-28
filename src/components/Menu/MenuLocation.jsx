import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// redux toolkit
import { useSelector, useDispatch } from "react-redux";
import {
  searchLocation,
  selectSearchLocations,
  saveCitySelected,
  clearCitysSelected,
} from "../../redux/slices/locationsSlice";

const MenuLocation = () => {
  const dispatch = useDispatch();

  // load data từ redux
  const locations = useSelector(selectSearchLocations);
  const citySelected = useSelector((state) => state.location.citySelected);

  // state
  const [searchCityText, setSearchCityText] = useState("");

  // Xử lý khi nhập tìm kiếm
  const changeSearchCityText = (e) => {
    const text = e.target.value;
    setSearchCityText(text);
    dispatch(searchLocation(text));
  };

  // Chọn hoặc bỏ chọn tỉnh/thành
  const toggleCity = (city) => {
    dispatch(saveCitySelected(city));
  };

  // Bỏ chọn tất cả
  const uncheckAll = () => {
    dispatch(clearCitysSelected());
  };

  return (
    <div className="bg-white border border-gray-300 shadow-lg rounded-lg z-50 w-80">
      {/* Ô tìm kiếm */}
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-4 rounded-full border border-slate-300 overflow-hidden">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="px-2 text-xl" />
          <input
            type="text"
            className="py-2 outline-none w-full"
            placeholder="Nhập tỉnh/thành phố"
            value={searchCityText}
            onChange={changeSearchCityText}
          />
        </div>

        {/* Danh sách tỉnh/thành */}
        <div className="max-h-40 overflow-y-auto">
          {locations.map((city) => (
            <label
              key={city.name}
              className="flex items-center space-x-2 mb-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={citySelected.includes(city.name)}
                onChange={() => toggleCity(city)}
                className="text-xl cursor-pointer"
                style={{ width: "0.8em", height: "0.8em" }}
              />
              <span>{city.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Footer nút điều khiển */}
      <div className="flex justify-between shadow-inner p-4">
        <button className="text-slate-400" onClick={uncheckAll}>
          Bỏ chọn tất cả
        </button>
      </div>
    </div>
  );
};

MenuLocation.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default MenuLocation;
