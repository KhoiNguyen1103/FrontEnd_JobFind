import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllJobs = async () => {
  try {
    const response = await axios.get(`${API_URL}/job/searchJobs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
