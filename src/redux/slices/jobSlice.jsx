import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobApi from "../../api/jobApi";
import jobs from "../../data/jobs";
import fakeJobs from "../../components/dataFake/FakeJobs";

// Thunk
export const fetchJobsByCompanyId = createAsyncThunk(
  "jobs/fetchJobsByCompanyId",
  async (companyId, thunkAPI) => {
    try {
      const response = await jobApi.getByCompanyId(companyId, companyId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi không xác định"
      );
    }
  }
);

export const fetchJobsPropposeByJSKId = createAsyncThunk(
  "jobs/fetchJobsProposeByJSKId",
  async (jskId, thunkAPI) => {
    try {
      const response = await jobApi.getProposedJobs(jskId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi không xác định"
      );
    }
  }
);

export const fetchAllJobs = createAsyncThunk(
  "jobs/fetchAllJobs",
  async (thunkAPI) => {
    try {
      const response = await jobApi.search();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi không xác định"
      );
    }
  }
);

const JOBS_PER_PAGE = 6;

const initState = {
  jobs: jobs,
  jobsPropose: [],
  jobsByCompanyId: [], // Lưu job của công ty đang xem trong trang company detail
  filterJobs: [],
  renderJobs: [],
  selectedJob: null,
  relatedJobs: [],
  jobsSaved: [],
  filterOptions: {
    salary: "", // Ví dụ: "10000000"
    workType: "Tất cả", // "Toàn thời gian", "Bán thời gian", "Tất cả"
  },
  loading: true,
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState: { ...initState, filterJobs: initState.jobs },
  reducers: {
    setSelectedJob: (state, action) => {
      // lưu job được chọn
      state.selectedJob = action.payload;
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
            return job.salaryMin <= 5000000 && job.salaryMax >= 5000000;
          });
        } else if (salary === "10000000") {
          result = result.filter(
            (job) => job.salaryMin <= 10000000 && 10000000 <= job.salaryMax
          );
        } else if (salary === "15000000") {
          result = result.filter(
            (job) => job.salaryMin <= 15000000 && 15000000 <= job.salaryMax
          );
        } else if (salary === "20000000") {
          result = result.filter(
            (job) => job.salaryMin <= 20000000 && 20000000 <= job.salaryMax
          );
        } else if (salary === "20000000+") {
          result = result.filter((job) => job.salaryMin >= 20000000);
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
    filterJob: (state, action) => {
      const { CATEGORY, WORK_TYPE, DATE, LOCATION, SALARY, EXPERIENCE } =
        action.payload;

      // const now = new Date();
      state.filterJobs = state.jobsByCompanyId.filter((job) => {
        const matchCategory = CATEGORY ? job.category === CATEGORY : true;
        const matchWorkType = WORK_TYPE ? job.workType === WORK_TYPE : true;
        const matchLocation = LOCATION ? job.location === LOCATION : true;
        const matchExperience = EXPERIENCE
          ? job.experience === EXPERIENCE
          : true;
        // const matchSalary = SALARY
        //   ? job.salary >= SALARY.min && job.salary <= SALARY.max
        //   : true;

        // const matchDate = DATE
        //   ? (() => {
        //       const jobDate = new Date(job.postedDate);
        //       const diffDays = Math.floor(
        //         (now - jobDate) / (1000 * 60 * 60 * 24)
        //       );
        //       return diffDays <= DATE;
        //     })()
        //   : true;

        return (
          matchCategory && matchWorkType && matchLocation && matchExperience
          // matchSalary &&
          // matchDate
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // ----- fetchJobsByCompanyId -----
      .addCase(fetchJobsByCompanyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobsByCompanyId.fulfilled, (state, action) => {
        state.loading = false;
        state.jobsByCompanyId = action.payload;
        state.filterJobs = action.payload;
      })
      .addCase(fetchJobsByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- fetchJobsPropposeByJSKId -----
      .addCase(fetchJobsPropposeByJSKId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobsPropposeByJSKId.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.filterJobs = action.payload;
      })
      .addCase(fetchJobsPropposeByJSKId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- fetchAllJobs -----
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.filterJobs = action.payload;
      })

      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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
