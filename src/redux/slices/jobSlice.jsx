import { createSlice } from "@reduxjs/toolkit";

import jobs from "../../data/jobs";

const JOBS_PER_PAGE = 6;

const initState = {
  jobs: jobs,
  currentPage: 1,
  filterJobs: [],
  paginationJobs: jobs.slice(0, JOBS_PER_PAGE),
  selectedJob: null,
  relatedJobs: [],
  jobsSaved: [],
};

const jobSlice = createSlice({
  name: "jobs",
  initialState: { ...initState, filterJobs: initState.jobs },
  reducers: {
    filterJob: (state, action) => {
      const { key, value } = action.payload;
      state.filterJobs = state.jobs.filter((job) => {
        // lọc lương
        const duoi5tr = job.salary_min <= 5 && true;
        const tu5toi10tr =
          ((job.salary_min <= 5 && job.salary_max >= 5) ||
            (job.salary_min >= 5 && job.salary_min <= 10)) &&
          true;
        const tu10den15tr =
          ((job.salary_min <= 10 && job.salary_max >= 10) ||
            (job.salary_min >= 10 && job.salary_min <= 15)) &&
          true;
        const tu15den20tr =
          ((job.salary_min <= 15 && job.salary_max >= 15) ||
            (job.salary_min >= 15 && job.salary_min <= 20)) &&
          true;
        const tren20tr = (job.salary_min >= 20 || job.salary_max >= 20) && true;

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
        // lọc vị trí
        if (key === 5) {
          return value.id === 1 ? true : job.position === value.name;
        }
        // lọc hình thức làm việc
        if (key === 6) {
          return value.id === 3 ? true : job.workType === value.name;
        }
        return true;
      });
      // Reset lại trang khi filter
      state.currentPage = 1;
      state.paginationJobs = state.filterJobs.slice(0, JOBS_PER_PAGE);
    },
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
    paginateJobs: (state, action) => {
      state.currentPage = action.payload;
      const start = (state.currentPage - 1) * JOBS_PER_PAGE;
      state.paginationJobs = state.filterJobs.slice(
        start,
        start + JOBS_PER_PAGE
      );
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
} = jobSlice.actions;
export default jobSlice.reducer;
