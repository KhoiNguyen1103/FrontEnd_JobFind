import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCategories,
  clearSelectedCategories,
} from "../../redux/slices/categorySlice";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MenuCategory = () => {
  const dispatch = useDispatch();
  // load data từ redux và local storage
  const { categories } = useSelector((state) => state.category);
  const selectedCategories = useSelector(
    (state) => state.category.selectedCategories
  );

  // react hook
  const [searchText, setSearchText] = useState("");

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
    <div>
      <div className="flex justify-between items-center gap-2">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Tìm kiếm danh mục..."
          className="flex-1 p-2 rounded-md outline-none"
        />
        <FontAwesomeIcon
          icon={faArrowRotateRight}
          className="text-xl text-red-600 pe-2 cursor-pointer hover:scale-110 transition-all"
          onClick={handleClear}
        />
      </div>

      <hr />

      <div className="overflow-y-auto h-52" style={{ scrollbarWidth: "none" }}>
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
    </div>
  );
};

MenuCategory.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default MenuCategory;
