import axiosClient from "./axiosClient";

const jobSeekerApi = {
  getAll: () => {
    const url = '/jobseeker/all';
    return axiosClient.get(url);
  },
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

  searchJobSeekers: (keyword, categoryIds, locationList, companyId) => {
    const params = new URLSearchParams();

    if (keyword) {
      params.append('keyword', keyword);
    }

    categoryIds.forEach(id => {
      params.append('categoryIds', id);
    });

    locationList.forEach(loc => {
      params.append('location', loc);
    });

    if (companyId) {
      params.append('companyId', companyId);
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
