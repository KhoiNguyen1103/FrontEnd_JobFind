import { createSlice } from "@reduxjs/toolkit";
import categories from "../../data/categories";

const initialState = {
  categories: categories,
  selectedCategories: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    saveCategory: (state, action) => {
      const category = action.payload;
      // Kiểm tra tồn tại
      const exists = state.selectedCategories.find(
        (item) => item.id === category.id
      );
      if (exists) {
        state.selectedCategories = state.selectedCategories.filter(
          (item) => item.id !== category.id
        );
      } else {
        state.selectedCategories = [...state.selectedCategories, category];
      }
    },
    clearSelectedCategories: (state) => {
      state.selectedCategories = [];
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
  },
});

export const { saveCategory, clearSelectedCategories, setSelectedCategories } =
  categorySlice.actions;
export default categorySlice.reducer;
