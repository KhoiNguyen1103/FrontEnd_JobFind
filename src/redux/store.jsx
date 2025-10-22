import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./slices/jobSlice";
import locationReducer from "./slices/locationsSlice";
import authReducer from "./slices/authSlice";
import industrySlice from "../redux/slices/industrySlice";
import cvReducer from "./slices/cvSlice";
import savedJobReducer from "./slices/savedJobSlice";
import categoryReducer from "./slices/categorySlice";
import savedJobseekerReducer from "./slices/savedJobseekerSlice";

const store = configureStore({
  reducer: {
    jobs: jobReducer,
    locations: locationReducer,
    auth: authReducer,
    industry: industrySlice,
    cv: cvReducer,
    savedJob: savedJobReducer,
    category: categoryReducer,
    savedJobseeker: savedJobseekerReducer,
  },
});

export default store;
