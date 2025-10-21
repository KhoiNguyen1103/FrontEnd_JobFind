import { createSlice } from "@reduxjs/toolkit";
// data
import saved_jobs from "../../data/saved_jobs";

const initialState = {
  savedJobs: saved_jobs, // Load danh sách công việc đã lưu từ data
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
        (job) => job.saved_job_id !== action.payload
      );
    },
  },
});

export const { setSavedJobs, addSavedJob, removeSavedJob } =
  savedJobSlice.actions;
export default savedJobSlice.reducer;
