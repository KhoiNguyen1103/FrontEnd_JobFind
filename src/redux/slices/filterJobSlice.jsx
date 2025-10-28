import { createSlice } from "@reduxjs/toolkit";

// thunk

const initialState = {
  jobsRaw: [],
  jobsFiltered: [],
  context: "", // "recommend", "search", "company", "savedJob"
};

const filterJobsSlice = createSlice({
  name: "filterJobs",
  initialState,
  reducers: {
    setJobsRaw: (state, action) => {
      const { jobs, context } = action.payload;
      console.log("action payload: ", action.payload);
      state.jobsRaw = jobs;
      state.jobsFiltered = jobs;
      state.context = context;
    },
    setJobsFiltered: (state, action) => {
      const { jobs, context } = action.payload;
      state.jobsFiltered = jobs;
      state.context = context;
    },
    clearJobsRaw: (state) => {
      state.jobsRaw = [];
    },
    resetFilter: (state) => {
      state.jobsFiltered = state.jobsRaw;
    },
    filterJobs: (state, action) => {
      const { LOCATION, CATEGORY, EXPERIENCE, WORKTYPE } = action.payload;

      let filtered = [...state.jobsRaw];

      // Lọc LOCATION
      if (LOCATION && LOCATION !== "Tất cả") {
        filtered = filtered.filter((job) => job.location === LOCATION);
      }

      // Lọc CATEGORY
      if (CATEGORY && CATEGORY !== "Tất cả") {
        filtered = filtered.filter((job) => job.category === CATEGORY);
      }

      // Lọc EXPERIENCE
      if (EXPERIENCE && EXPERIENCE !== "Tất cả") {
        filtered = filtered.filter((job) => {
          if (!job.yearsOfExperience) return false;

          const [minExp, maxExp] = job.yearsOfExperience.split("-").map(Number);

          if (EXPERIENCE === "5-100") {
            return minExp >= 5;
          }

          const [minExpFilter, maxExpFilter] =
            EXPERIENCE.split("-").map(Number);
          return maxExp >= minExpFilter && minExp <= maxExpFilter;
        });
      }

      // Lọc WORKTYPE
      if (WORKTYPE && WORKTYPE !== "Tất cả") {
        filtered = filtered.filter(
          (job) =>
            job.jobType ===
            (WORKTYPE === "Toàn thời gian" ? "FULLTIME" : "PARTTIME")
        );
      }

      state.jobsFiltered = filtered;
    },
  },
});

export const {
  setJobsRaw,
  clearJobsRaw,
  setJobsFiltered,
  filterJobs,
  resetFilter,
} = filterJobsSlice.actions;
export default filterJobsSlice.reducer;
