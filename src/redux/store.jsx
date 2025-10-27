import jobReducer from "./slices/jobSlice";
import locationReducer from "./slices/locationsSlice";
import authReducer from "./slices/authSlice";
import industrySlice from "../redux/slices/industrySlice";
import cvReducer from "./slices/cvSlice";
import savedJobReducer from "./slices/savedJobSlice";
import categoryReducer from "./slices/categorySlice";
import savedJobseekerReducer from "./slices/savedJobseekerSlice";
import JSKReducer from "./slices/JSKerProfileSlice";
import chatBoxReducer from "./slices/chatBoxSlice";
import applicationReducer from "./slices/applySlice";
import CompanyReducer from "./slices/companySlide";
import CompanyReviewReducer from "./slices/companyReviewSlice";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["savedJobseeker"],
};

const rootReducer = combineReducers({
  jobs: jobReducer,
  locations: locationReducer,
  auth: authReducer,
  industry: industrySlice,
  cv: cvReducer,
  savedJob: savedJobReducer,
  category: categoryReducer,
  savedJobseeker: savedJobseekerReducer,
  jobSeekerProfile: JSKReducer,
  application: applicationReducer,
  company: CompanyReducer,
  companyReview: CompanyReviewReducer,
  chatBox: chatBoxReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
