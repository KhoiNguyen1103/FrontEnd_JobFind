// import { useLocation } from "react-router-dom";
import FilterSideBar from "./FilterSideBar";
import ListJobFiltered from "./ListJobFiltered";

// redux
import { useDispatch, useSelector } from "react-redux";
import { filterJobByCategory } from "../../redux/slices/jobSlice";
import { useEffect } from "react";

const SearchResult = () => {
  // Lấy dữu liệu từ queryParam
  // const location = useLocation();
  // // const queryParams = new URLSearchParams(location.search);

  // // const keyword = queryParams.get("keyword");
  // // const category = queryParams.get("category")?.split(",") || [];
  // // const locationSelected = queryParams.get("location")?.split(",") || [];

  // console.log("Keyword:", keyword);
  // console.log("Category:", category);
  // console.log("Location:", locationSelected);

  // Lấy danh sách categories đã chọn từ slice
  const selectedCategories = useSelector(
    (state) => state.categories.selectedCategories
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedCategories) {
      dispatch(filterJobByCategory(selectedCategories));
    }
  }, [dispatch, selectedCategories]);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between">
        {/* Filter Side Bar */}
        <div className="w-1/4">
          <FilterSideBar />
        </div>
        {/* List Job */}
        <div className="w-3/4">
          <ListJobFiltered />
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
