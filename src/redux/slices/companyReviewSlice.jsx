import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import companyReviewApi from "../../api/companyReview";
import { toast } from "react-toastify";

// --- Thunks ---

export const fetchReviewsByCompanyId = createAsyncThunk(
  "companyReview/fetchByCompanyId",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await companyReviewApi.getReviewsByCompanyId(companyId);
      return response;
    } catch (error) {
      toast.error("Lỗi khi tải đánh giá công ty");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCompanyReview = createAsyncThunk(
  "companyReview/create",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await companyReviewApi.createReview(reviewData);
      toast.success("Gửi đánh giá thành công");
      return response;
    } catch (error) {
      toast.error("Không thể gửi đánh giá");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCompanyReview = createAsyncThunk(
  "companyReview/update",
  async ({ reviewId, updateData }, { rejectWithValue }) => {
    try {
      const response = await companyReviewApi.updateReview(
        reviewId,
        updateData
      );
      toast.success("Cập nhật đánh giá thành công");
      return response;
    } catch (error) {
      toast.error("Không thể cập nhật đánh giá");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCompanyReview = createAsyncThunk(
  "companyReview/delete",
  async (reviewId, { rejectWithValue }) => {
    try {
      await companyReviewApi.deleteReview(reviewId);
      toast.success("Xoá đánh giá thành công");
      return reviewId;
    } catch (error) {
      toast.error("Không thể xoá đánh giá");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- Slice ---

const companyReviewSlice = createSlice({
  name: "companyReview",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Reviews
      .addCase(fetchReviewsByCompanyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByCompanyId.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(addCompanyReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      })

      // Update
      .addCase(updateCompanyReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteCompanyReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      });
  },
});

export default companyReviewSlice.reducer;
