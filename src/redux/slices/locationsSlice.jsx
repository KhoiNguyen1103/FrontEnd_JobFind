import { createSlice } from "@reduxjs/toolkit";
import citys from "../../data/citys";

const initState = {
  locations: citys, // Danh sách tỉnh/thành
  searchResults: citys, // Kết quả tìm kiếm (ban đầu là toàn bộ danh sách)
  citySelected: JSON.parse(localStorage.getItem("selectedCities")) || [], // Mảng chứa tên tỉnh/thành đã chọn
};

const locationSlice = createSlice({
  name: "locations",
  initialState: initState,
  reducers: {
    // Tìm kiếm tỉnh/thành
    searchLocation: (state, action) => {
      const keyword = action.payload.toLowerCase();
      state.searchResults =
        keyword === ""
          ? state.locations
          : state.locations.filter((location) =>
              location.name.toLowerCase().includes(keyword)
            );
    },

    // Lưu tỉnh/thành được chọn hoặc bỏ chọn
    saveCitySelected: (state, action) => {
      const cityName = action.payload.name;
      if (state.citySelected.includes(cityName)) {
        // Nếu đã chọn thì bỏ chọn
        state.citySelected = state.citySelected.filter((c) => c !== cityName);
      } else {
        // Nếu chưa chọn thì thêm vào
        state.citySelected.push(cityName);
      }
    },

    // Bỏ chọn tất cả tỉnh/thành
    clearCitysSelected: (state) => {
      state.citySelected = [];
    },
  },
});

export const { searchLocation, saveCitySelected, clearCitysSelected } =
  locationSlice.actions;

export const selectSearchLocations = (state) => state.location.searchResults;

export default locationSlice.reducer;
