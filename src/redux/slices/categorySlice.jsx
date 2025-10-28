import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobCategoryApi from "../../api/jobCategoryApi";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const res = await jobCategoryApi.getAll();
      return res;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return thunkAPI.rejectWithValue("Không thể lấy danh sách danh mục");
    }
  }
);

const initialState = {
  categories: [],
  selectedCategories: [],
  loading: true,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
    toggleCategories: (state, action) => {
      const category = action.payload;
      const exists = state.selectedCategories.some(
        (item) => item.jobCategoryId === category.jobCategoryId
      );

      state.selectedCategories = exists
        ? state.selectedCategories.filter(
            (item) => item.jobCategoryId !== category.jobCategoryId
          )
        : [...state.selectedCategories, category];
    },
    clearSelectedCategories: (state) => {
      state.selectedCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCategories,
  toggleCategories,
  clearSelectedCategories,
  setSelectedCategories,
} = categorySlice.actions;

export default categorySlice.reducer;
