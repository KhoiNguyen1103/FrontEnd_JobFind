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

export const getJobById = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/job/getJobById/${jobId}`);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getJobById:", error);
    throw error;
  }
};

export const searchJobs = async ({
  keyword = "",
  industries = "",
  locations = "",
}) => {
  // console.log("keyword", keyword);
  // console.log("industry", industries);
  // console.log("location", locations);
  try {
    const queryParams = new URLSearchParams();

    if (keyword) queryParams.append("keyword", keyword);
    if (industries) queryParams.append("industry", industries[0]);
    if (locations) queryParams.append("location", locations[0]);
    // console.log(
    //   "queryParams",
    //   `${API_URL}/job/searchJobs?${queryParams.toString()}`
    // );

    const response = await axios.get(
      `${API_URL}/job/searchJobs?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm job:", error);
    throw error;
  }
};
