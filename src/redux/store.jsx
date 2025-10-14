import { configureStore } from "@reduxjs/toolkit";
import jobReucer from "./slices/jobSlice";
import locationReducer from "./slices/locationsSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    jobs: jobReucer,
    locations: locationReducer,
    auths: authReducer,
  },
});

export default store;
