import axiosClient from './axiosClient';

const savedJobSeekerApi = {
  save: (jobSeekerProfileId, companyId) => {
    const url = '/savedJobSeeker/save';
    const params = { jobSeekerProfileId, companyId };
    return axiosClient.post(url, null, { params });
  },

  unsave: (jobSeekerProfileId, companyId) => {
    const url = '/savedJobSeeker/unsave';
    const params = { jobSeekerProfileId, companyId };
    return axiosClient.post(url, null, { params });
  },

  getListSaved: (companyId) => {
    const url = '/savedJobSeeker/listSavedJobSeekers';
    const params = { companyId };
    return axiosClient.get(url, { params });
  }
};

export default savedJobSeekerApi;
