// src/redux/slices/jobSeekerProfileSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobSeekerApi from "../../api/jobSeekerApi";

export const fetchJobSeekerProfileByUserId = createAsyncThunk(
  "jobSeekerProfile/fetchByUserId",
  async (userId, thunkAPI) => {
    try {
      const response = await jobSeekerApi.getProfileByUserId(userId);
      console.log("Response from API:", response);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy profile:", error);
      return thunkAPI.rejectWithValue("Không thể lấy thông tin hồ sơ");
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const jobSeekerProfileSlice = createSlice({
  name: "jobSeekerProfile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobSeekerProfileByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobSeekerProfileByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchJobSeekerProfileByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = jobSeekerProfileSlice.actions;

export default jobSeekerProfileSlice.reducer;
