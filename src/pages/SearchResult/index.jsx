import { useLocation } from "react-router-dom";
import FilterSideBar from "./FilterSideBar";
import ListJobFiltered from "./ListJobFiltered";

// redux
import { useDispatch } from "react-redux";
import { filterJobByCategory } from "../../redux/slices/jobSlice";
import { useEffect } from "react";

const SearchResult = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedCategories = location.state?.selectedSubcategories;
  useEffect(() => {
    if (selectedCategories) {
      dispatch(filterJobByCategory(selectedCategories));
    }
  }, [dispatch, selectedCategories]);

  return (
    <div className="container mx-auto py-4 flex justify-between">
      {/* Filter Side Bar */}
      <div className="w-1/4">
        <FilterSideBar />
      </div>
      {/* List Job */}
      <div className="w-3/4">
        <ListJobFiltered />
      </div>
    </div>
  );
};

export default SearchResult;
