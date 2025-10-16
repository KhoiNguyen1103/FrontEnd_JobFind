import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cvList: [],
  status: "idle",
  error: null,
};

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    addCV: (state, action) => {
      state.cvList.push(action.payload);
    },
  },
});

export const { addCV } = cvSlice.actions;
export default cvSlice.reducer;
