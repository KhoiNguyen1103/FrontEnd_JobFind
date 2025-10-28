import axiosClient from './axiosClient';

const companyApi = {
  getAll: () => {
    const url = '/company/all';
    return axiosClient.get(url);
  },

  getById: (companyId) => {
    const url = `/company/${companyId}`;
    return axiosClient.get(url);
  },

  searchCompanies: (industryId, companyName) => {
    const params = {};
    if (industryId !== undefined && industryId !== null) {
      params.industryId = industryId;
    }
    if (companyName) {
      params.companyName = companyName;
    }

    return axiosClient.get('/company/searchCompany', { params });
  },
};

export default companyApi;
