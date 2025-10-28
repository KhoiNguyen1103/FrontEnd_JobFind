import axiosClient from './axiosClient';

const orderApi = {
    createOrder: (orderRequest) => {
        return axiosClient.post('/order/create', orderRequest);
    },

    chargeOrder: (orderId) => {
        return axiosClient.put(`/order/charge/${orderId}`);
    },

    getOrderByUserId: (userId) => {
        return axiosClient.get(`order/user/${userId}`);
    }
};

export default orderApi;
