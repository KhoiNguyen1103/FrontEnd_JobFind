import { configureStore } from "@reduxjs/toolkit";
import jobReucer from "./slices/jobSlice";
import locationReducer from "./slices/locationsSlice";
import authReducer from "./slices/authSlice";
import industrySlice from "../redux/slices/industrySlice";
import cvReducer from "./slices/cvSlice";
import savedJobReducer from "./slices/savedJobSlice";
import categoryReducer from "./slices/categorySlice";

const store = configureStore({
  reducer: {
    jobs: jobReucer,
    locations: locationReducer,
    auth: authReducer,
    industry: industrySlice,
    cv: cvReducer,
    savedJob: savedJobReducer,
    category: categoryReducer,
  },
});

export default store;
