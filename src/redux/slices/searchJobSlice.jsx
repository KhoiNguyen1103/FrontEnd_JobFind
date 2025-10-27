import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobApi from "../../api/jobApi";

export const searchJobs = createAsyncThunk(
  "jobs/searchJobs",
  async ({ keyword, locations, jobCategoryIds }, thunkAPI) => {
    try {
      const response = await jobApi.search(keyword, locations, jobCategoryIds);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi không xác định"
      );
    }
  }
);

const initialState = {
  results: [],
  loading: true,
  error: null,
};

const searchJobSlice = createSlice({
  name: "searchJob",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.results = action.payload;
        state.loading = false;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export const { clearResults } = searchJobSlice.actions;
export default searchJobSlice.reducer;
