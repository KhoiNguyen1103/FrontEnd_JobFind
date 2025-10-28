import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cvList: [],
  status: "idle",
  error: null,
  isSubmit: false,
};

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    setCVs: (state, action) => {
      state.cvList = action.payload;
    },
    addCV: (state, action) => {
      state.cvList.push(action.payload);
    },
    removeCV: (state, action) => {
      state.cvList = state.cvList.filter((cv) => cv.name !== action.payload);
    },
    // test
    submitCV: (state) => {
      state.isSubmit = true;
    },
  },
});

export const { addCV, submitCV, removeCV, setCVs } = cvSlice.actions;
export default cvSlice.reducer;
