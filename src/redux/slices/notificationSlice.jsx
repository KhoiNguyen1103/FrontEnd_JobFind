import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notificationUnreadCount: 0,
    },
    reducers: {
        setNotificationUnreadCount(state, action) {
            state.notificationUnreadCount = action.payload;
        },
    },
});

export const { setNotificationUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;