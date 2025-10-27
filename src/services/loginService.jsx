import axios from "axios";
// import * as dotenv from "dotenv";

const API_URL = `${import.meta.env.VITE_API_URL}/auth/login`;

const loginService = async ({ email, password }) => {
  try {
    const response = await axios.post(API_URL, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Đăng nhập thất bại" };
  }
};

export default loginService;
