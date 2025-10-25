import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FilterSideBar from "./FilterSideBar";
import ListJobFiltered from "./ListJobFiltered";
import { searchJobs } from "../../services/Job";
import { setFilterJob } from "../../redux/slices/jobSlice";
import { useDispatch } from "react-redux";
import jobApi from "../../api/jobApi";

const SearchResult = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const keyword = queryParams.get("keyword") || "";
  const industryIds =
    queryParams
      .get("industry")
      ?.split(",")
      .map((id) => Number(id)) || [];
  const locationIds =
    queryParams
      .get("location")
      ?.split(",")
      .map((loc) => loc.trim()) || [];
  // console.log("locationIds", locationIds[0]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Call API search
  // useEffect(() => {
  //   // console.log("LocationIds", locationIds[0]); // ỉn ra đc Hà Nội
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const result = await searchJobs({
  //         keyword,
  //         industries:
  //           industryIds === null
  //             ? null
  //             : industryIds.length === 0
  //             ? null
  //             : industryIds,
  //         locations:
  //           locationIds === null
  //             ? null
  //             : locationIds.length === 0
  //             ? null
  //             : locationIds,
  //       });
  //       // console.log(result); // in ra đc danh sách job
  //       setJobs(result);
  //       dispatch(setFilterJob(result)); // lưu job vào redux
  //     } catch (error) {
  //       console.error("Lỗi khi tìm kiếm job:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await jobApi.search(keyword, locationIds);
        // console.log(result); // in ra đc danh sách job
        setJobs(result);
        dispatch(setFilterJob(result)); // lưu job vào redux
      } catch (error) {
        console.error("Lỗi khi tìm kiếm job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

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
          ) : jobs.length > 0 ? (
            <ListJobFiltered />
          ) : (
            <p>Không có công việc nào phù hợp.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
