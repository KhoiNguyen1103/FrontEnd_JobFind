import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import companyApi from "../../api/companyApi";
import fakeCompanies from "../../components/dataFake/companiesFake";

// Async thunk để lấy danh sách công ty
export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (_, thunkAPI) => {
    try {
      const response = await companyApi.searchCompanies(); // gọi API từ file companyApi
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi không xác định"
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.companies = fakeCompanies;
      });
  },
});

export default companySlice.reducer;
