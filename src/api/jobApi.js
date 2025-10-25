import axiosClient from "./axiosClient";

const jobApi = {
  create: (jobData) => {
    const url = "/job/create";
    return axiosClient.post(url, jobData);
  },

  update: (jobId, jobData) => {
    const url = `/job/update`;
    return axiosClient.put(url, { jobId, ...jobData });
  },

  delete: (jobId) => {
    const url = `/job/delete/${jobId}`;
    return axiosClient.delete(url);
  },

  search: (keyword, location, jobCategoryId) => {
    const url = "/job/searchJobs";
    const params = {};

    if (keyword && keyword.trim() !== "") params.keyword = keyword;
    if (location) params.location = location;
    if (jobCategoryId !== undefined && jobCategoryId !== null) {
      params.jobCategoryId = jobCategoryId;
    }
    // console.log("params", params);
    return axiosClient.get(url, { params });
  },

  getByCompanyId: (companyId, id) => {
    const url = `/job/company/${companyId}`;
    return axiosClient.get(url, {
      params: {
        id: id,
      },
    });
  },

  getByCategory: (categoryId) => {
    const url = `/job/category/${categoryId}`;
    return axiosClient.get(url);
  },

  getById: (jobId) => {
    const url = `/job/getJobById/${jobId}`;
    return axiosClient.get(url);
  },

  approve: (jobId) => {
    const url = `/job/approve/${jobId}`;
    return axiosClient.put(url);
  },
};

export default jobApi;
