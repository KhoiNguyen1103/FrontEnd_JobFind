import { createSlice } from "@reduxjs/toolkit";

const initState = {
  locations: [
    {
      name: "Hồ Chí Minh",
      districts: ["Quận 1", "Quận 2", "Quận 3"],
    },
    {
      name: "Hà Nội",
      districts: ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Hai Bà Trưng"],
    },
    {
      name: "Đà Nẵng",
      districts: ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà"],
    },
    {
      name: "Cần Thơ",
      districts: [
        "Quận Ninh Kiều",
        "Quận Bình Thủy",
        "Quận Cái Răng",
        "Quận Ô Môn",
      ],
    },
    {
      name: "Hải Phòng",
      districts: ["Quận Hồng Bàng", "Quận Lê Chân", "Quận Ngô Quyền"],
    },
  ],
  searchResults: [],
  citySelected: [], // Mảng chứa name tỉnh/thành
  districtsSelected: [],
};

const locationSlice = createSlice({
  name: "locations",
  initialState: { ...initState, searchResults: initState.locations },
  reducers: {
    searchLocation: (state, action) => {
      const keyword = action.payload.toLowerCase();
      state.searchResults =
        keyword === ""
          ? state.locations
          : state.locations.filter((location) =>
              location.name.toLowerCase().includes(keyword)
            );
    },
    saveCitySelected: (state, action) => {
      state.city = action.payload;

      if (state.citySelected.includes(state.city.name)) {
        state.citySelected = state.citySelected.filter(
          (c) => c !== state.city.name
        );
        state.districtsSelected = state.districtsSelected.filter((d) => {
          return !state.city.districts.includes(d);
        });
      } else {
        state.citySelected.push(state.city.name);
        state.districtsSelected = [
          ...state.districtsSelected,
          ...state.city.districts,
        ];
      }
    },
    clearCitysSelected: (state) => {
      state.citySelected = [];
      state.districtsSelected = [];
    },
    saveDistrictSelected: (state, action) => {
      state.district = action.payload;

      if (state.districtsSelected.includes(state.district)) {
        state.districtsSelected = state.districtsSelected.filter(
          (d) => d !== state.district
        );
      } else {
        state.districtsSelected.push(state.district);
      }
    },
    clearDistrictsSelected: (state) => {
      state.districtsSelected = [];
    },
  },
});

export const {
  searchLocation,
  saveCitySelected,
  saveDistrictSelected,
  clearCitysSelected,
  clearDistrictsSelected,
} = locationSlice.actions;
export const selectSearchLocations = (state) => state.locations.searchResults;
export default locationSlice.reducer;
