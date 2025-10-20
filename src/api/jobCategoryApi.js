import axiosClient from './axiosClient';

const jobCategoryApi = {
    getAll: () => {
        const url = '/jobCategory/all';
        return axiosClient.get(url);
    },

    add: (jobCategoryName) => {
        const url = `/jobCategory/add`;
        const params = new URLSearchParams();
        params.append('jobCategoryName', jobCategoryName);
        return axiosClient.post(url, params);
    },

    delete: (jobCategoryId) => {
        const url = `/jobCategory/delete/${jobCategoryId}`;
        return axiosClient.delete(url);
    },

    update: (jobCategoryId, jobCategoryName) => {
        const url = `/jobCategory/update`;
        const params = new URLSearchParams();
        params.append('jobCategoryId', jobCategoryId);
        params.append('jobCategoryName', jobCategoryName);
        return axiosClient.put(url, params);
    }
};

export default jobCategoryApi;
