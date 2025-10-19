import PropTypes from "prop-types";
import { useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  saveCategory,
  clearSelectedCategories,
} from "../../redux/slices/categorySlice";

const MenuCategory = ({ setIsOpen }) => {
  const dispatch = useDispatch();

  // Lấy danh sách category từ Redux store
  const categories = useSelector((state) => state.categories.categories);

  // Lấy danh sách categories đã chọn
  const selectedCategories = useSelector(
    (state) => state.categories.selectedCategories
  );

  // State tìm kiếm
  const [searchText, setSearchText] = useState("");

  // Lọc danh mục nghề theo từ khóa tìm kiếm
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Chọn hoặc bỏ chọn category
  const handleClickItemCategory = (category) => {
    dispatch(saveCategory(category));
  };

  // button Áp dụng
  const handleSaveSubCategories = () => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories)
    );
    setIsOpen(false);
  };

  // button Clear
  const handleClear = () => {
    dispatch(clearSelectedCategories());
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
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="py-2 px-4 flex items-center whitespace-nowrap cursor-pointer hover:bg-slate-200"
              onClick={() => handleClickItemCategory(category)}
            >
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer"
                checked={selectedCategories.some(
                  (item) => item.id === category.id
                )}
                onChange={() => handleClickItemCategory(category)}
              />
              <p className="ps-4">{category.name}</p>
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
          onClick={handleSaveSubCategories}
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
