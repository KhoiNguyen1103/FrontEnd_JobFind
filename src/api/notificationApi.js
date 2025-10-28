import axiosClient from "./axiosClient";

const notificationApi = {
    getNotificationsByUserId: (userId) =>
        axiosClient.get(`/notification/user/${userId}`),

    countUnreadNotifications: (userId) =>
        axiosClient.get(`/notification/user/${userId}/unread-count`),

    markAsRead: (notificationId) =>
        axiosClient.put(`/notification/${notificationId}/read`),

    markAllAsRead: (userId) =>
        axiosClient.put(`/notification/user/${userId}/read-all`)
};

export default notificationApi;
