import axiosClient from './axiosClient';

const subscriptionPlanApi = {
    getSubscriptionPlan: (planId) => {
        return axiosClient.get(`/plan/${planId}`);
    },

    listAllSubscriptionPlans: () => {
        return axiosClient.get('/plan/list');
    }
};

export default subscriptionPlanApi;
