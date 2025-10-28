import axiosClient from "./axiosClient";

const resumeApi = {
  createResume: (profileId, resumeRequest) => {
    const url = `/resume/create/${profileId}`;
    return axiosClient.post(url, resumeRequest);
  },

  deleteResume: (resumeId) => {
    const url = `/resume/delete/${resumeId}`;
    return axiosClient.delete(url);
  },
};

export default resumeApi;
