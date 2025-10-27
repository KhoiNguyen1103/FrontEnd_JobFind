import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCategories,
  clearSelectedCategories,
} from "../../redux/slices/categorySlice";

const MenuCategory = ({ setIsOpen }) => {
  const dispatch = useDispatch();
  // load data từ redux và local storage
  const categories = useSelector((state) => state.category.categories);
  const selectedCategories = useSelector(
    (state) => state.category.selectedCategories
  );

  // react hook
  const [searchText, setSearchText] = useState("");
  const [searchCategories, setSearchCategories] = useState([]);

  // handle search category
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // handle click item
  const handleClickItem = (category) => {
    dispatch(toggleCategories(category));
  };

  // handle clear selectedCategories
  const handleClear = () => {
    dispatch(clearSelectedCategories());
  };

  return (
    <div className="min-w-[300px]">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Tìm kiếm danh mục..."
        className="w-full p-2 mb-2 border rounded-md outline-none"
      />

      <div
        className="overflow-y-auto"
        style={{ height: "300px", scrollbarWidth: "none" }}
      >
        <div className="border-r-2">
          {filteredCategories.map((category) => (
            <div
              key={category.jobCategoryId}
              className="py-2 px-4 flex items-center whitespace-nowrap cursor-pointer hover:bg-slate-200"
              onClick={() => handleClickItem(category)}
            >
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer"
                checked={selectedCategories.some(
                  (item) => item.jobCategoryId === category.jobCategoryId
                )}
                onChange={() => handleClickItem(category)}
              />
              <p className="ps-4">{category.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <p
          className="text-slate-300 cursor-pointer flex items-center"
          onClick={handleClear}
        >
          Bỏ chọn tất cả
        </p>
      </div>
    </div>
  );
};

MenuCategory.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default MenuCategory;
