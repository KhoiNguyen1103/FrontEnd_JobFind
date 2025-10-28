// src/redux/slices/jobSeekerProfileSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobSeekerApi from "../../api/jobSeekerApi";
import resumeApi from "../../api/resumeApi";

export const fetchJobSeekerProfileByUserId = createAsyncThunk(
  "jobSeekerProfile/fetchByUserId",
  async (userId, thunkAPI) => {
    try {
      const response = await jobSeekerApi.getProfileByUserId(userId);
      // console.log("Response from API:", response);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy profile:", error);
      return thunkAPI.rejectWithValue("Không thể lấy thông tin hồ sơ");
    }
  }
);

// Thunk để xóa CV theo id
export const deleteCV = createAsyncThunk(
  "jobSeekerProfile/deleteCV",
  async (cvId, thunkAPI) => {
    try {
      await resumeApi.deleteResume(cvId);
      return cvId;
    } catch (error) {
      console.error("Lỗi khi xóa CV:", error);
      return thunkAPI.rejectWithValue("Xóa CV thất bại");
    }
  }
);

// Thunk để thêm CV
export const addCV = createAsyncThunk(
  "jobSeekerProfile/addCV",
  async (file, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userId = state.jobSeekerProfile.user?.id;

      if (!userId) throw new Error("Không tìm thấy ID người dùng");

      const formData = new FormData();
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      formData.append("resumeName", nameWithoutExtension);
      formData.append("resume", file);

      await resumeApi.createResume(userId, formData);
      await thunkAPI.dispatch(fetchJobSeekerProfileByUserId(userId));
    } catch (error) {
      const errorData = error.response?.data;
      return thunkAPI.rejectWithValue({
        errorCode: errorData?.errorCode,
        message: errorData?.message,
      });
    }
  }
);

const initialState = {
  profile: null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  cvs: [],
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
        state.cvs = action.payload.resumeList || [];
      })
      .addCase(fetchJobSeekerProfileByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================ Xóa CV =================
      .addCase(deleteCV.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.cvs = state.cvs.filter((cv) => cv.resumeId !== deletedId);
      })
      .addCase(deleteCV.rejected, (state, action) => {
        state.error = action.payload;
      })
      // ================ Thêm CV =================
      .addCase(addCV.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = jobSeekerProfileSlice.actions;

export default jobSeekerProfileSlice.reducer;
