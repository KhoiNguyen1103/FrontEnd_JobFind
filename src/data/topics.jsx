export const TOPICS = {
    CONVERSATION: (conversationId) => `/topic/conversation/${conversationId}`,
    UNREAD_COUNT: (userId) => `/topic/unread-count/${userId}`,
    CONVERSATION_DATA: (id) => `/topic/conversation-data/${id}`,
};