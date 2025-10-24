import axiosClient from './axiosClient';

const applicationApi = {
    applyForJob: (applicationRequest) => {
        const url = '/application/apply';
        return axiosClient.post(url, applicationRequest);
    },

    getApplicationHistory: (applicationId) => {
        const url = `/application/${applicationId}/history`;
        return axiosClient.get(url);
    },

    updateApplicationStatus: (applicationId, status) => {
        const url = `/application/updateStatus/${applicationId}`;
        return axiosClient.put(url, null, { params: { status } });
    },

    getApplicationOfJob: (jobId) => {
        const url = `/application/job/${jobId}`;
        return axiosClient.get(url);
    },
};

export default applicationApi;
