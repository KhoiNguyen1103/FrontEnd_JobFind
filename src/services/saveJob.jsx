import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const user = localStorage.getItem("user"); // Lấy token đã lưu sau khi login
// chuyển token từ string sang object
const userObject = JSON.parse(user);

export const saveJob = async (jobId) => {
  try {
    // console.log("userObject", userObject.token);
    // console.log(
    //   `${API_URL}/savedJob/save?jobId=${jobId}&jobSeekerProfileId=${userObject?.userId}`
    // );

    const response = await axios.post(
      `${API_URL}/savedJob/save?jobId=${jobId}&jobSeekerProfileId=${userObject?.userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userObject?.token}`, // Thêm token vào header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lưu job:", error);
    throw error;
  }
};

export const getListSavedJob = async () => {
  try {
    const result = await axios.get(
      `${API_URL}/savedJob/listSavedJobs?jobSeekerProfileId=${userObject?.userId}`,
      {
        headers: {
          Authorization: `Bearer ${userObject?.token}`, // Thêm token vào header
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách job đã lưu:", error);
    throw error;
  }
};

export const unSaveJob = async (jobId) => {
  try {
    const result = await axios.post(
      `${API_URL}/savedJob/unsave?jobId=${jobId}&jobSeekerProfileId=${userObject?.userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userObject?.token}`, // Thêm token vào header
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Lỗi khi bỏ lưu job:", error);
    throw error;
  }
};
