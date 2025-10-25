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
      const user = action.payload;
      console.log("user", action.payload);

      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(user.token));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Xóa user khỏi localStorage khi logout
      localStorage.removeItem("token"); // Xóa user khỏi localStorage khi logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
