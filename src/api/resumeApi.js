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
  autoCreateResume(profileId, resumeName) {
    return axiosClient.post(`/resume/auto-create/${profileId}`, null, {
      params: {
        resumeName: resumeName,
      },
    });
  },
};

export default resumeApi;
