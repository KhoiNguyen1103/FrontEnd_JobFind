import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk để fetch danh sách industry từ API
export const fetchIndustries = createAsyncThunk(
  "industry/fetchIndustries",
  async (_, thunkAPI) => {
    try {
      // const industries = await getAllIndustry();
      const response = null;
      return response;
    } catch (error) {
      console.error("Error fetching industries:", error);
      return thunkAPI.rejectWithValue("Không thể lấy danh sách ngành nghề");
    }
  }
);

const initialState = {
  industries: [],
  selectedIndustries:
    JSON.parse(localStorage.getItem("selectedIndustries")) || [], // Lấy từ localStorage nếu có
  loading: false,
  error: null,
};

const industrySlice = createSlice({
  name: "industry",
  initialState,
  reducers: {
    saveIndustry: (state, action) => {
      const industry = action.payload;
      const exists = state.selectedIndustries.find(
        (item) => item.industryId === industry.industryId
      );
      if (exists) {
        state.selectedIndustries = state.selectedIndustries.filter(
          (item) => item.industryId !== industry.industryId
        );
      } else {
        state.selectedIndustries = [...state.selectedIndustries, industry];
      }
      console.log(
        "Selected industries after toggle:",
        state.selectedIndustries
      );
    },
    clearSelectedIndustries: (state) => {
      state.selectedIndustries = [];
    },
    setSelectedIndustries: (state, action) => {
      state.selectedIndustries = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.loading = false;
        state.industries = action.payload;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { saveIndustry, clearSelectedIndustries, setSelectedIndustries } =
  industrySlice.actions;

export default industrySlice.reducer;
