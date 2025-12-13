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
  autoCreateResume(profileId, data) {
    return axiosClient.post(`/resume/auto-create/${profileId}`, {
      resumeName: data.resumeName,
      summary: data.summary,
      careerObjective: data.careerObjective,
      educations: data.educations,
      certifications: data.certifications,
      projects: data.projects,
    });
  },
};

export default resumeApi;
