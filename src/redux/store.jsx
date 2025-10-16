import { configureStore } from "@reduxjs/toolkit";
import jobReucer from "./slices/jobSlice";
import locationReducer from "./slices/locationsSlice";
import authReducer from "./slices/authSlice";
import categorySlice from "../redux/slices/categorySlice";
import cvReducer from "./slices/cvSlice";

const store = configureStore({
  reducer: {
    jobs: jobReucer,
    locations: locationReducer,
    auths: authReducer,
    categories: categorySlice,
    cv: cvReducer,
  },
});

export default store;
