import axiosClient from './axiosClient';

const industryApi = {
    getAll: () => {
        const url = '/companyIndustry/all';
        return axiosClient.get(url);
    },
};

export default industryApi;