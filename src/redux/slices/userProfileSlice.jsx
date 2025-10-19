import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfiles: [
    {
      id: 1,
      name: "Nguyễn Văn A",
      job: "Kỹ sư phần mềm",
    },
  ],
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
});

export default userProfileSlice.reducer;
