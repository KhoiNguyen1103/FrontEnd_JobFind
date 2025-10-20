import { createSlice } from "@reduxjs/toolkit";

import jobs from "../../data/jobs";

const JOBS_PER_PAGE = 6;

const initState = {
  jobs: jobs,
  filterJobs: [],
  renderJobs: [],
  selectedJob: null,
  relatedJobs: [],
  jobsSaved: [],
  filterOptions: {
    salary: "", // Ví dụ: "10000000"
    workType: "Tất cả", // "Toàn thời gian", "Bán thời gian", "Tất cả"
  },
};

const jobSlice = createSlice({
  name: "jobs",
  initialState: { ...initState, filterJobs: initState.jobs },
  reducers: {
    setSelectedJob: (state, action) => {
      // lưu job được chọn
      state.selectedJob = action.payload;

      // lọc ra các job liên quan
      state.relatedJobs = state.jobs.filter(
        (job) =>
          job.category === action.payload.category &&
          job.id !== action.payload.id
      );
    },
    setFilterJob: (state, action) => {
      // lưu job được chọn
      state.selectedJob = action.payload;

      state.filterJobs = state.selectedJob;
      state.renderJobs = state.selectedJob;
    },
    applyAdvancedFilters: (state) => {
      const { salary, workType } = state.filterOptions;
      let result = [...state.filterJobs];
      // console.log(JSON.parse(JSON.stringify(result)));

      // Lọc theo hình thức làm việc
      if (workType !== "Tất cả") {
        result = result.filter((job) =>
          workType === "Bán thời gian"
            ? job.jobType === "PARTTIME" // chỉnh ở đây nha
            : job.jobType === "FULLTIME"
        );
      }

      // Lọc theo lương
      if (salary !== "0") {
        if (salary === "5000000") {
          result = result.filter((job) => {
            return job.salaryMin <= 5 && job.salaryMax >= 5;
          });
        } else if (salary === "10000000") {
          result = result.filter(
            (job) => job.salaryMin <= 10 && 10 <= job.salaryMax
          );
        } else if (salary === "15000000") {
          result = result.filter(
            (job) => job.salaryMin <= 15 && 15 <= job.salaryMax
          );
        } else if (salary === "20000000") {
          result = result.filter(
            (job) => job.salaryMin <= 20 && 20 <= job.salaryMax
          );
        } else if (salary === "20000000+") {
          result = result.filter((job) => job.salaryMin >= 20);
        }
      }

      state.renderJobs = result;
    },
    updateFilterOptions: (state, action) => {
      state.filterOptions = {
        ...state.filterOptions,
        ...action.payload,
      };
    },
    setRenderJobs: (state, action) => {
      state.renderJobs = action.payload;
    },
    likeJob: (state, action) => {
      const job = action.payload;
      // console.log(job); // in ra dc
      if (state.jobsSaved.some((j) => j.id === job.id)) {
        state.jobsSaved = state.jobsSaved.filter((j) => j.id !== job.id);
      } else {
        state.jobsSaved = [...state.jobsSaved, job];
      }
    },
    unSaveJob: (state, action) => {
      const job_id = action.payload;
      state.jobsSaved = state.jobsSaved.filter((j) => j.id !== job_id);
    },
    filterJobByCategory: (state, action) => {
      const categories = action.payload; // danh sách subcategories đã chọn
      // console.log(categories);
      state.filterJobs = state.jobs.filter((job) =>
        categories.includes(job.category)
      );
      // console.log(state.filterJobs);
    },
  },
});

// Lấy số lượng job
export const countJob = (state) => state.jobs.jobs.length;
export const maxPage = (state) =>
  Math.ceil(state.jobs.filterJobs.length / JOBS_PER_PAGE);

export const {
  filterJob,
  relatedJob,
  paginateJobs,
  setSelectedJob,
  likeJob,
  unSaveJob,
  filterJobByCategory,
  setFilterJob,
  setRenderJobs,
  updateFilterOptions,
  applyAdvancedFilters,
} = jobSlice.actions;
export default jobSlice.reducer;
