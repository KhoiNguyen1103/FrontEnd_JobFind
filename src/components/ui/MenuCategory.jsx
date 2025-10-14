import categories from "../../data/categories";
import { useEffect, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { selectCategory } from "../../redux/slices/categorySlice";

const MenuCategory = () => {
  const dispatch = useDispatch();

  // Danh sách category đã chọn từ Redux store
  const selectedCategories = useSelector(
    (state) => state.categories.selectedCategories
  );

  // Lưu category đang chọn để hiển thị subcategories
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    console.log("Danh sách category đã chọn:", selectedCategories);
  }, [selectedCategories]);

  // Click vào một nghề => thêm/xóa nghề khỏi danh sách
  const handleClickCategory = (category) => {
    dispatch(selectCategory(category));

    // Nếu đã chọn, bỏ chọn; nếu chưa chọn, thêm vào danh sách
    if (selectedCategories.some((c) => c.id === category.id)) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // Click vào một vị trí chuyên môn => thêm/xóa vị trí khỏi danh sách
  const toggleSubCategory = (categoryId, subcategory) => {
    console.log(`Toggle subcategory: ${subcategory} của nghề ${categoryId}`);
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
                selectedCategories.some((c) => c.id === category.id) &&
                "bg-slate-200"
              }`}
              onClick={() => handleClickCategory(category)}
            >
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selectedCategories.some((c) => c.id === category.id)}
                onChange={() => handleClickCategory(category)}
              />
              <p className="ps-4">{category.name}</p>
            </div>
          ))}
        </div>
        {/* end: Nhóm nghề */}

        {/* Nghề - Vị trí chuyên môn */}
        <div className="px-4 w-full">
          <p className="font-bold pb-2 border-b-2">Vị trí chuyên môn</p>
          {selectedCategory?.subcategories.map((subcategory) => (
            <div
              key={subcategory}
              className="flex items-center py-2 cursor-pointer px-4 whitespace-nowrap"
            >
              <input
                type="checkbox"
                checked={selectedCategories.some(
                  (category) =>
                    category.id === selectedCategory.id &&
                    category.subcategories.includes(subcategory)
                )}
                onChange={() =>
                  toggleSubCategory(selectedCategory.id, subcategory)
                }
                className="w-4 h-4"
              />
              <p className="ps-2">{subcategory}</p>
            </div>
          ))}
        </div>
        {/* end: Nghề - vị trí chuyên môn */}
      </div>
    </div>
  );
};

export default MenuCategory;
