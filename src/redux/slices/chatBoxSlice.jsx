import { createSlice } from '@reduxjs/toolkit';

const chatBoxSlice = createSlice({
    name: 'chatBox',
    initialState: {
        chatBoxes: [],
        totalUnreadCount: 0, // Khởi tạo totalUnreadCount là số để tránh lỗi undefined
    },
    reducers: {
        openChatBox: (state, action) => {
            const { conversationId, profileId, userId, displayName } = action.payload;
            const identifier = profileId || conversationId;
            if (!state.chatBoxes.find(box => box.profileId === identifier || box.conversationId === identifier)) {
                state.chatBoxes.push({
                    profileId: profileId || null,
                    userId: userId || null,
                    displayName: displayName || null,
                    conversationId: conversationId || null,
                    isMinimized: false,
                    index: state.chatBoxes.length,
                });
            }
        },
        setConversationId: (state, action) => {
            const { profileId, conversationId } = action.payload;
            const chatBox = state.chatBoxes.find(box => box.profileId === profileId);
            if (chatBox) {
                chatBox.conversationId = conversationId;
            }
        },
        minimizeChatBox: (state, action) => {
            const { profileId, conversationId } = action.payload;
            const identifier = profileId || conversationId;
            state.chatBoxes = state.chatBoxes.map(box =>
                box.profileId === identifier || box.conversationId === identifier
                    ? { ...box, isMinimized: true }
                    : box
            );
        },
        maximizeChatBox: (state, action) => {
            const { profileId, conversationId } = action.payload;
            const identifier = profileId || conversationId;
            state.chatBoxes = state.chatBoxes.map(box =>
                box.profileId === identifier || box.conversationId === identifier
                    ? { ...box, isMinimized: false }
                    : box
            );
        },
        closeChatBox: (state, action) => {
            const { profileId, conversationId } = action.payload;
            const identifier = profileId || conversationId;
            state.chatBoxes = state.chatBoxes
                .filter(box => box.profileId !== identifier && box.conversationId !== identifier)
                .map((box, index) => ({ ...box, index }));
        },
        setTotalUnreadCount: (state, action) => {
            state.totalUnreadCount = typeof action.payload === 'number'
                ? action.payload
                : action.payload?.data || 0; 
        },
    },
});

export const { openChatBox, setConversationId, minimizeChatBox, maximizeChatBox, closeChatBox, setTotalUnreadCount } =
    chatBoxSlice.actions;

export default chatBoxSlice.reducer;