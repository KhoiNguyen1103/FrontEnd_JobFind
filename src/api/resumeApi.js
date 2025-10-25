import axiosClient from "./axiosClient";

const resumeApi = {
  cretaeResume: (profileId, resumeRequest) => {
    console.log("resumeRequest", resumeRequest);
    console.log("profileId", profileId);
    const url = `/resume/create/${profileId}`;
    return axiosClient.post(url, resumeRequest);
  },

  deleteResume: (resumeId) => {
    const url = `/resume/delete/${resumeId}`;
    return axiosClient.delete(url);
  },
};

export default resumeApi;
