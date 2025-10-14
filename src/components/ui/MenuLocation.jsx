import { useState } from "react";
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
  saveDistrictSelected,
  clearDistrictsSelected,
} from "../../redux/slices/locationsSlice";

const MenuLocation = ({ setIsOpen }) => {
  const dispatch = useDispatch();
  const locations = useSelector(selectSearchLocations);
  const citySelected = useSelector((state) => state.locations.citySelected);
  const districtsSelected = useSelector(
    (state) => state.locations.districtsSelected
  );

  // Tìm kiếm theo tên thành phố
  const [searchCityText, setSearchCityText] = useState("");
  // Theo dõi sự thay đổi trong ô input
  const changeSearchCityText = (e) => {
    const text = e.target.value;
    setSearchCityText(text);
    dispatch(searchLocation(text));
  };

  // Lưu danh sách thành phố đưuọc chọn
  const handleAddCity = (city) => {
    dispatch(saveCitySelected(city));
  };

  // Lưu thành phố đang focus hiện tại để hiện danh sách quận huyện ra
  const [citySelectedCurrent, setCitySelectedCurrent] = useState();
  const handleSaveCitySelectedCurrent = (city) => {
    setCitySelectedCurrent(city);
  };

  // lưu danh sách quận huyện được chọn
  const handleAddDistrict = (district) => {
    dispatch(saveDistrictSelected(district));
  };

  // Unchecked tất cả ô chọn trong model địa điểm
  const uncheckAll = () => {
    dispatch(clearCitysSelected());
    dispatch(clearDistrictsSelected());
    setCitySelectedCurrent(null);
  };

  return (
    <div className="bg-white border border-gray-300 shadow-lg rounded-lg z-50">
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
                onClick={() => handleSaveCitySelectedCurrent(city)}
              >
                <input
                  type="checkbox"
                  checked={citySelected.includes(city.name)}
                  onChange={() => handleAddCity(city)}
                  className="text-xl cursor-pointer"
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
                    onChange={() => handleAddDistrict(district)}
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
  );
};
MenuLocation.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default MenuLocation;
