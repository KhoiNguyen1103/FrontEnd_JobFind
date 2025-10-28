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

  search: (keyword, locations, jobCategoryIds) => {
    const url = "/job/searchJobs";

    // Nếu không có tham số nào thì lấy tất cả job
    if (!keyword && !locations && !jobCategoryIds) {
      return axiosClient.get(url);
    }

    const params = {};
    if (keyword) params.keyword = keyword;
    if (locations && locations.length > 0) {
      params.location = locations;
    }
    if (jobCategoryIds && jobCategoryIds.length > 0)
      params.jobCategoryId = jobCategoryIds;
    // console.log("params: ", params);

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

  getProposedJobs: (jskId) => {
    const url = `/job/proposedJobs/${jskId}`;
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
