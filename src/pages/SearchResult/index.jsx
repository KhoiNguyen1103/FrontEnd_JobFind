import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FilterSideBar from "./FilterSideBar";
import ListJobFiltered from "./ListJobFiltered";
import { setFilterJob } from "../../redux/slices/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import jobApi from "../../api/jobApi";
import { use } from "react";
import { searchJobs } from "../../redux/slices/searchJobSlice";
import JobItemv2 from "../../components/ui/JobItemv2";

const SearchResult = () => {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ url
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";
  const locationParam = queryParams.get("location") || "";
  const jobCategoryId = queryParams.get("jobCategoryId") || "";

  // console.log("UI search result: ", keyword, locationParam, jobCategoryId);

  // fetch data
  useEffect(() => {
    // Xử lý dữ liệu
    const keyWordTrimed = keyword.trim();
    const locationsArray = locationParam
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l !== "");
    const jobCategoryIdsArray = jobCategoryId
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    dispatch(
      searchJobs({
        keyword: keyWordTrimed,
        locations: locationsArray,
        jobCategoryIds: jobCategoryIdsArray,
      })
    );
  }, [keyword, locationParam, jobCategoryId, dispatch]);

  // load data từ redux
  const loading = useSelector((state) => state.searchJob.loading);
  const searchJobResults = useSelector((state) => state.searchJob.results);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between">
        {/* Filter Side Bar */}
        <div className="w-1/4">
          <FilterSideBar />
        </div>

        {/* List Job */}
        <div className="w-3/4">
          {loading ? (
            <p>Đang tải dữ liệu công việc...</p>
          ) : searchJobResults.length > 0 ? (
            <div>
              <p className="text-2xl py-3">
                {searchJobResults.length} công việc hiện có
              </p>

              {searchJobResults.map((job) => (
                <JobItemv2 job={job} key={job.jobId} isApply={false} />
              ))}
            </div>
          ) : (
            <p>Không có công việc nào phù hợp.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
