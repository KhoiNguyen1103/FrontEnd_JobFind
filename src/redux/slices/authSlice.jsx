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
      console.log("Đăng nhập thành công:", action.payload);
      const { user } = action.payload;
      console.log("User đăng nhập:", user);
      // 1 là nhà tuyển dụng
      // if(user.role === 1) {

      // }
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
