import axiosClient from './axiosClient';

const conversationApi = {
    createConversation: (jobSeekerId, employerId) => {
        const url = '/chat/conversation';
        const params = { jobSeekerId, employerId };
        return axiosClient.post(url, null, { params });
    },

    getUserConversations: (userId) => {
        const url = `/chat/conversations/${userId}`;
        return axiosClient.get(url);
    },

    getConversationById: (conversationId, userId) => {
        const url = `/chat/conversation/${conversationId}?userId=${userId}`;
        return axiosClient.get(url);
    },

    sendTextMessage: (data) => {
        const url = '/chat/message/text';
        return axiosClient.post(url, data);
    },

    sendFileMessage: (data) => {
        const url = '/chat/message/file';
        return axiosClient.post(url, data);
    },

    getMessagesByConversationId: (conversationId) => {
        const url = `/chat/messages/${conversationId}`;
        return axiosClient.get(url);
    },

    markMessagesAsRead: (conversationId, userId) => {
        const url = '/chat/messages/read';
        const params = { conversationId, userId };
        return axiosClient.post(url, null, { params });
    },

    countUnreadConversations: (userId) => {
        const url = `/chat/conversations/unread/${userId}`;
        return axiosClient.get(url);
    }
};

export default conversationApi;
