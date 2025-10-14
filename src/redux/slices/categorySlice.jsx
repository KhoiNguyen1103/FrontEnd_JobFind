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
    selectCategory: (state, action) => {
      const selectedCategory = action.payload;

      const isExist = state.selectedCategories.some(
        (category) => category.id === selectedCategory.id
      );

      if (isExist) {
        // Xóa category nếu đã có
        state.selectedCategories = state.selectedCategories.filter(
          (category) => category.id !== selectedCategory.id
        );
      } else {
        // Thêm category nếu chưa có
        state.selectedCategories = [
          ...state.selectedCategories,
          selectedCategory,
        ];
      }

      console.log(state.selectedCategories);
    },
  },
});

export const { selectCategory } = categorySlice.actions;
export default categorySlice.reducer;
