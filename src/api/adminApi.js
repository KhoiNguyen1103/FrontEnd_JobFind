import axiosClient from './axiosClient';

const adminApi = {
    getDashboardStats: () => axiosClient.get('/admin/stats'),

    getRecentApplications: () =>
        axiosClient.get('/admin/applications/recent'),

    getApplicationTrends: (type, month) =>
        axiosClient.get('/admin/applications/trends', {
            params: {
                type,
                ...(month !== null && { month }),
            },
        }),


    getActiveRegions: (type, month) =>
        axiosClient.get('/admin/regions/active', {
            params: {
                type,
                ...(month !== null && { month }),
            },
        }),
};

export default adminApi;
