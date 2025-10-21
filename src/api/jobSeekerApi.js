import axiosClient from "./axiosClient";

const jobSeekerApi = {
  getProfileByUserId: (userId) => {
    const url = `/jobseeker/getProfileByUserId?userId=${userId}`;
    return axiosClient.get(url);
  },

  getProfileById: (jobSeekerId) => {
    const url = `/jobseeker/getProfileById?jobSeekerId=${jobSeekerId}`;
    return axiosClient.get(url);
  },

  addWorkExperience: (userId, workExpRequest) => {
    const url = `/jobseeker/addWorkExperience?userId=${userId}`;
    return axiosClient.post(url, workExpRequest);
  },

  updateWorkExperience: (userId, workExpRequest) => {
    const url = `/jobseeker/updateWorkExperience?userId=${userId}`;
    return axiosClient.post(url, workExpRequest);
  },

  addSkill: (skillRequest) => {
    const url = `/jobseeker/addSkill`;
    return axiosClient.post(url, skillRequest);
  },

  updateSkill: (skillRequest) => {
    const url = `/jobseeker/updateSkill`;
    return axiosClient.post(url, skillRequest);
  },

  searchJobSeekers: (keyword, categoryIds) => {
    const params = new URLSearchParams();

    categoryIds.forEach((id) => {
      params.append("categoryIds", id);
    });

    if (keyword) {
      params.append("keyword", keyword);
    }

    const url = `/jobseeker/search-jobseekers?${params.toString()}`;
    return axiosClient.get(url);
  },

  findJobSeekersByCompanyIndustry: (companyId) => {
    const url = `/jobseeker/find-jobseekers-by-company-industry?companyId=${companyId}`;
    return axiosClient.get(url);
  },
};

export default jobSeekerApi;
