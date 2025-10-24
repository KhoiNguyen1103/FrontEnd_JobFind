// axiosClient.js (SỬA)
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => new URLSearchParams(params).toString(),
});

axiosClient.interceptors.request.use(async (config) => {
  try {
    const user = localStorage.getItem("user");
    if (user) {
      const userObject = JSON.parse(user);
      const token = userObject?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    // Để handler 401 bên ngoài gọi
    return Promise.reject(error);
  }
);

export default axiosClient;
