// src/redux/slices/applicationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import applicationApi from "../../api/applicationApi";

// Async thunk: lấy danh sách application theo jobId
export const fetchApplicationByJSK = createAsyncThunk(
  "application/fetchByJob",
  async (jobSeekerId, { rejectWithValue }) => {
    try {
      const response = await applicationApi.getApplycationByUserId(jobSeekerId);
      return response; // hoặc response nếu bạn đã xử lý response.data trong axiosClient
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addApplication: (state, action) => {
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationByJSK.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationByJSK.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchApplicationByJSK.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi không xác định.";
      });
  },
});

export const { addApplication } = applicationSlice.actions;

export default applicationSlice.reducer;
