// src/services/industryService.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllIndustry = async () => {
  const user = localStorage.getItem("user"); // Lấy token đã lưu sau khi login
  // chuyển token từ string sang object
  const userObject = JSON.parse(user);

  const response = await axios.get(`${API_URL}/companyIndustry/all`, {
    headers: {
      Authorization: `Bearer ${userObject?.token}`, // Sử dụng token từ localStorage
    },
  });

  return response.data;
};
