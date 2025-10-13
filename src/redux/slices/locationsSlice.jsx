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
  },
});

export const { searchLocation } = locationSlice.actions;
export const selectSearchLocations = (state) => state.locations.searchResults;
export default locationSlice.reducer;
