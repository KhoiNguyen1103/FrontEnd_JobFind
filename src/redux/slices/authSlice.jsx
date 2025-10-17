import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user } = action.payload;
      // 1 là nhà tuyển dụng
      // if(user.role === 1) {

      // }
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Xóa user khỏi localStorage khi logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
