import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import savedJobApi from "../../api/savedJobApi";

export const fetchSavedJobs = createAsyncThunk(
  "savedJob/fetchSavedJobs",
  async (jobSeekerProfileId, thunkAPI) => {
    try {
      const response = await savedJobApi.listSavedJobs(jobSeekerProfileId);
      return response;
    } catch (error) {
      console.error("Lỗi khi load saved jobs:", error);
      return thunkAPI.rejectWithValue(
        "Không thể lấy danh sách công việc đã lưu"
      );
    }
  }
);

const initialState = {
  savedJobs: [], // Load danh sách công việc đã lưu từ data
  loading: false,
  error: null,
};

const savedJobSlice = createSlice({
  name: "savedJob",
  initialState,
  reducers: {
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
    },
    addSavedJob: (state, action) => {
      // Kiểm tra nếu job đã tồn tại trong danh sách thì không thêm trùng
      const exists = state.savedJobs.some(
        (job) => job.job_id === action.payload.job_id
      );
      if (!exists) {
        state.savedJobs.push(action.payload);
      }
    },
    removeSavedJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter(
        (job) => job.jobId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload;
      });
  },
});

export const { setSavedJobs, addSavedJob, removeSavedJob } =
  savedJobSlice.actions;
export default savedJobSlice.reducer;
