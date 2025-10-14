import { createSlice } from "@reduxjs/toolkit";

import jobs from "../../data/jobs";

const JOBS_PER_PAGE = 6;

const initState = {
  jobs: jobs,
  currentPage: 1,
  filterJobs: [],
  paginationJobs: jobs.slice(0, JOBS_PER_PAGE),
};

const jobSlice = createSlice({
  name: "jobs",
  initialState: { ...initState, filterJobs: initState.jobs },
  reducers: {
    filterJob: (state, action) => {
      const { key, value } = action.payload;
      state.filterJobs = state.jobs.filter((job) => {
        // lọc lương
        const salary = job.salary;
        const duoi5tr = salary[0] <= 5 && true;
        const tu5toi10tr =
          ((salary[0] <= 5 && salary[1] >= 5) ||
            (salary[0] >= 5 && salary[0] <= 10)) &&
          true;
        const tu10den15tr =
          ((salary[0] <= 10 && salary[1] >= 10) ||
            (salary[0] >= 10 && salary[0] <= 15)) &&
          true;
        const tu15den20tr =
          ((salary[0] <= 15 && salary[1] >= 15) ||
            (salary[0] >= 15 && salary[0] <= 20)) &&
          true;
        const tren20tr = (salary[0] >= 20 || salary[1] >= 20) && true;

        if (key === "Địa điểm") {
          return value === "Tất cả" ? true : job.location === value;
        }
        if (key === "Mức lương") {
          if (value === "Tất cả") return true;
          if (value === "Dưới 5 triệu") return duoi5tr;
          if (value === "5 - 10 triệu") return tu5toi10tr;
          if (value === "10 - 15 triệu") return tu10den15tr;
          if (value === "15 - 20 triệu") return tu15den20tr;
          if (value === "Trên 20 triệu") return tren20tr;
        }
        if (key === "Kinh nghiệm") {
          if (value === "Tất cả") return true;
          if (value === "Chưa có kinh nghiệm") return job.experience === 0;
          if (value === "1 năm") return job.experience === 1;
          if (value === "2 năm") return job.experience === 2;
          if (value === "3 năm") return job.experience === 3;
          if (value === "4 năm") return job.experience === 4;
          if (value === "5 năm") return job.experience >= 5;
        }
        if (key === "Ngành nghề") {
          return value === "Tất cả" ? true : job.category === value;
        }
        return true;
      });
      // Reset lại trang khi filter
      state.currentPage = 1;
      state.paginationJobs = state.filterJobs.slice(0, JOBS_PER_PAGE);
    },
    relatedJob: (state, action) => {
      const { category } = action.payload;
      state.filterJobs = state.jobs.filter((job) => job.category === category);
    },
    paginateJobs: (state, action) => {
      state.currentPage = action.payload;
      const start = (state.currentPage - 1) * JOBS_PER_PAGE;
      state.paginationJobs = state.filterJobs.slice(
        start,
        start + JOBS_PER_PAGE
      );
    },
  },
});

// Lấy số lượng job
export const countJob = (state) => state.jobs.jobs.length;
export const maxPage = (state) =>
  Math.ceil(state.jobs.filterJobs.length / JOBS_PER_PAGE);

export const { filterJob, relatedJob, paginateJobs } = jobSlice.actions;
export default jobSlice.reducer;
