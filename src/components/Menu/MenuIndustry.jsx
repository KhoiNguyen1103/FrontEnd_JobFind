import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  saveIndustry,
  clearSelectedIndustries,
  fetchIndustries,
} from "../../redux/slices/industrySlice";

const MenuCategory = ({ setIsOpen }) => {
  const dispatch = useDispatch();

  // Fetch industries khi component được mount
  useEffect(() => {
    dispatch(fetchIndustries());
  }, [dispatch]);

  // Lấy danh sách industry từ Redux store
  const industries = useSelector((state) => state.industry.industries);
  // console.log(industries);

  // Lấy danh sách industry đã chọn
  const selectedIndustries = useSelector(
    (state) => state.industry.selectedIndustries
  );

  // State tìm kiếm
  const [searchText, setSearchText] = useState("");

  // Lọc danh mục nghề theo từ khóa tìm kiếm
  const filteredIndustries = industries.filter((industry) =>
    industry.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Chọn hoặc bỏ chọn industry
  const handleClickItemIndustry = (industry) => {
    dispatch(saveIndustry(industry));
  };

  // button Áp dụng
  const handleSaveSelectedIndustries = () => {
    localStorage.setItem(
      "selectedIndustries",
      JSON.stringify(selectedIndustries)
    );
    setIsOpen(false);
  };

  // button Clear
  const handleClear = () => {
    dispatch(clearSelectedIndustries());
  };

  return (
    <div className="">
      {/* Ô tìm kiếm danh mục */}
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Tìm kiếm danh mục..."
        className="w-full p-2 mb-2 border rounded-md outline-none"
      />

      {/* Danh sách nghề với thanh cuộn */}
      <div
        className="overflow-y-auto"
        style={{ height: "300px", scrollbarWidth: "none" }}
      >
        <div className="border-r-2">
          {filteredIndustries.map((industry) => (
            <div
              key={industry.industryId}
              className="py-2 px-4 flex items-center whitespace-nowrap cursor-pointer hover:bg-slate-200"
              onClick={() => handleClickItemIndustry(industry)}
            >
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer"
                checked={selectedIndustries.some(
                  (item) => item.industryId === industry.industryId
                )}
                onChange={() => handleClickItemIndustry(industry)}
              />
              <p className="ps-4">{industry.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Button Áp dụng & Clear */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <p
          className="text-slate-300 cursor-pointer flex items-center"
          onClick={handleClear}
        >
          Bỏ chọn tất cả
        </p>
        <p
          className="bg-primary rounded-full text-white active:opacity-80 px-4 py-2 text-center cursor-pointer"
          onClick={handleSaveSelectedIndustries}
        >
          Áp dụng
        </p>
      </div>
    </div>
  );
};

MenuCategory.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default MenuCategory;
