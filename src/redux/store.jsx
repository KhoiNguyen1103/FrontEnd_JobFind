import { configureStore } from "@reduxjs/toolkit";
import jobReucer from "./slices/jobSlice";
import locationReducer from "./slices/locationsSlice";
import authReducer from "./slices/authSlice";
import categorySlice from "../redux/slices/categorySlice";

const store = configureStore({
  reducer: {
    jobs: jobReucer,
    locations: locationReducer,
    auths: authReducer,
    categories: categorySlice,
  },
});

export default store;
