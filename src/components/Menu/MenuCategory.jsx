import PropTypes from "prop-types";

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

  // Lưu category đang chọn

  // Danh sách category được chọn
  const handleClickItemCategory = (category) => {
    // setSelectedCategory(category);
    dispatch(saveCategory(category));
  };

  // button áp dụng
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
    <div>
      {/* danh sách nghề */}
      <div className="py-2 w-full">
        <div className="border-r-2">
          <p className="px-4 pb-2 border-b-2 font-bold">Nghề</p>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`py-2 cursor-pointer hover:bg-slate-200 px-4 flex items-center whitespace-nowrap`}
              onClick={() => handleClickItemCategory(category)}
            >
              <input
                type="checkbox"
                className="h-5 w-5 cursor-pointer"
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
      {/* end: danh sách nghề */}
      {/* Button Áp dụng */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <p
          className="bg-primary rounded-lg text-white active:opacity-80 px-4 py-2 text-center cursor-pointer"
          onClick={handleSaveSubCategories}
        >
          Áp dụng
        </p>
        <p
          className="bg-red-600 rounded-lg text-white active:opacity-80 px-4 py-2 text-center cursor-pointer"
          onClick={handleClear}
        >
          Clear
        </p>
      </div>
    </div>
  );
};

MenuCategory.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default MenuCategory;
