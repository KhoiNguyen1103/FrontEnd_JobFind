import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { saveSubCategories } from "../../redux/slices/categorySlice";
import { useNavigate } from "react-router-dom";

// utils
import createSlug from "../../untils/createSlug";

const MenuCategory = ({ setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy danh sách category từ Redux store
  const categories = useSelector((state) => state.categories.categories);

  // Lấy danh sách subcategories đã chọn từ Redux store
  const selectedSubcategoriesFromStore = useSelector(
    (state) => state.categories.selectedCategories
  );

  // Lưu category đang chọn
  const [selectedCategoryCurrent, setSelectedCategoryCurrent] = useState(null);
  const saveCategoryCurrent = (category) => {
    setSelectedCategoryCurrent(category);
  };

  // Lưu danh sách subcategory đã chọn
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  // Khi mở lại MenuCategory, cập nhật selectedSubcategories từ Redux
  useEffect(() => {
    setSelectedSubcategories(selectedSubcategoriesFromStore);
  }, [selectedSubcategoriesFromStore]);

  // Xử lý chọn subcategory
  const saveSubcategory = (subcategory) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories((prev) =>
        prev.filter((sub) => sub !== subcategory)
      );
    } else {
      setSelectedSubcategories((prev) => [...prev, subcategory]);
    }
  };

  // button áp dụng
  const handleSaveSubCategories = () => {
    dispatch(saveSubCategories(selectedSubcategories));
    setIsOpen(false);
    navigate("/search/" + createSlug(selectedSubcategories.join("-")), {
      state: { selectedSubcategories },
    });
    console.log(selectedSubcategories);
  };

  return (
    <div>
      <div className="flex py-2 h-96 w-full">
        {/* Nhóm nghề */}
        <div className="border-r-2">
          <p className="px-4 pb-2 border-b-2 font-bold">Nghề</p>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`py-2 cursor-pointer hover:bg-slate-200 px-4 flex items-center whitespace-nowrap ${
                selectedCategoryCurrent?.id === category.id
                  ? "bg-slate-200"
                  : ""
              }`}
              onClick={() => saveCategoryCurrent(category)}
            >
              <p className="">{category.name}</p>
            </div>
          ))}
        </div>
        {/* end: Nhóm nghề */}

        {/* subcategory - Vị trí chuyên môn */}
        <div className="px-4 w-full">
          <p className="font-bold pb-2 border-b-2">Vị trí chuyên môn</p>
          {selectedCategoryCurrent?.subcategories.map((subcategory) => (
            <div
              key={subcategory}
              className="flex items-center py-2 cursor-pointer px-4 whitespace-nowrap"
              onClick={() => saveSubcategory(subcategory)}
            >
              <input
                type="checkbox"
                checked={selectedSubcategories.includes(subcategory)}
                onChange={() => saveSubcategory(subcategory)}
                className="w-4 h-4"
              />
              <p className="ps-2">{subcategory}</p>
            </div>
          ))}
        </div>
        {/* end: Nghề - vị trí chuyên môn */}
      </div>
      {/* Button Áp dụng */}
      <div
        className="flex justify-end items-center p-4"
        onClick={handleSaveSubCategories}
      >
        <button className="bg-primary rounded-lg text-white active:opacity-80 px-4 py-2 mt-4">
          Áp dụng
        </button>
      </div>
    </div>
  );
};

MenuCategory.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default MenuCategory;
