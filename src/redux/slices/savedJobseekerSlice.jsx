import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import savedJobSeekerApi from "../../api/savedJobSeekerApi";

export const fetchSavedJobseekers = createAsyncThunk(
  "savedJobseeker/fetchSavedJobseekers",
  async (_, thunkAPI) => {
    try {
      const user = localStorage.getItem("user");
      const userObject = JSON.parse(user);
      const companyId = userObject.userId;
      const data = await savedJobSeekerApi.getListSaved(companyId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Không thể lấy danh sách jobseeker đã lưu");
    }
  }
);

export const saveJobseeker = createAsyncThunk(
  "savedJobseeker/saveJobseeker",
  async ({ profileId, companyId }, thunkAPI) => {
    try {
      await savedJobSeekerApi.save(profileId, companyId);
      return profileId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Lưu thất bại");
    }
  }
);

export const unsaveJobseeker = createAsyncThunk(
  "savedJobseeker/unsaveJobseeker",
  async ({ profileId, companyId }, thunkAPI) => {
    try {
      await savedJobSeekerApi.unsave(profileId, companyId);
      return profileId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Bỏ lưu thất bại");
    }
  }
);


const savedJobseekerSlice = createSlice({
  name: "savedJobseeker",
  initialState: {
    savedList: [],
    loading: false,
    error: null,
  },
  reducers: {
    addSavedJobseeker: (state, action) => {
      const exists = state.savedList.find(
        (item) => item.id === action.payload.id
      );
      if (!exists) {
        state.savedList.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedJobseekers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobseekers.fulfilled, (state, action) => {
        state.loading = false;
        state.savedList = action.payload;
      })
      .addCase(fetchSavedJobseekers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveJobseeker.fulfilled, (state, action) => {
        if (!state.savedList.some(item => item.profileId === action.payload)) {
          state.savedList.push({ profileId: action.payload });
        }
      })
      .addCase(unsaveJobseeker.fulfilled, (state, action) => {
        state.savedList = state.savedList.filter(item => item.profileId !== action.payload);
      });
  },
});

export const { addSavedJobseeker } = savedJobseekerSlice.actions;

export default savedJobseekerSlice.reducer;