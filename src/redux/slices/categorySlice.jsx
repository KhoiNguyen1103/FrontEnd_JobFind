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
    saveSubCategories: (state, action) => {
      const subcategories = action.payload;
      state.selectedCategories = subcategories;
    },
  },
});

export const { saveSubCategories } = categorySlice.actions;
export default categorySlice.reducer;
