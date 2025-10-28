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

  createCard: (cardRequest) => {
    const url = '/company/createCard';
    return axiosClient.post(url, cardRequest);
  },

  getCardInfo: (userId) => {
    const url = `/company/cardInfo/${userId}`;
    return axiosClient.get(url);
  },
};

export default companyApi;
