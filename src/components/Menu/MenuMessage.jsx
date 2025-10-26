
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import conversationApi from '../../api/conversationApi';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { openChatBox, setTotalUnreadCount } from '../../redux/slices/chatBoxSlice';

const MenuMessage = ({ userId, onClose }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        if (!userId) return;

        const fetchConversations = async () => {
            try {
                setLoading(true);
                const convResponse = await conversationApi.getUserConversations(userId);
                setConversations(convResponse || []);

                const totalUnread = await conversationApi.countUnreadConversations(user.id);
                dispatch(setTotalUnreadCount(totalUnread));
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [userId]);

    const handleSelectConversation = async (conversationId) => {
        try {
            // await conversationApi.markMessagesAsRead(conversationId, userId);
            setConversations(conversations.map(conv =>
                conv.conversationId === conversationId ? { ...conv, unreadCount: 0 } : conv
            ));
            const totalUnread = await conversationApi.countUnreadConversations(user.id);
            dispatch(setTotalUnreadCount(totalUnread));
            dispatch(openChatBox({ conversationId }));
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Tin nhắn</h3>
            </div>
            {loading ? (
                <div className="text-center text-gray-500 text-sm">Đang tải...</div>
            ) : conversations.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">Chưa có cuộc trò chuyện nào</div>
            ) : (
                <ul className="space-y-2">
                    {conversations.map(conv => {
                        const isSenderCurrentUser = conv.senderId === userId;
                        const displayName = isSenderCurrentUser
                            ? 'Bạn'
                            : conv.senderName?.trim().split(' ').slice(-1)[0] || 'Unknown';

                        return (
                            <li
                                key={conv.conversationId}
                                onClick={() => handleSelectConversation(conv.conversationId)}
                                className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                            >
                                <img
                                    src={conv.senderAvatar || 'https://via.placeholder.com/32'}
                                    alt={conv.senderName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="ml-2 flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-800 truncate">
                                            {conv.senderName || 'Unknown'}
                                        </span>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {conv.lastMessageAt ? formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true, locale: vi }) : ''}
                                        </span>
                                    </div>
                                    {conv.lastMessage && (
                                        <div className="flex items-center w-full max-w-[220px] overflow-hidden">
                                            <span className="text-sm font-medium text-gray-500">
                                                {displayName}:
                                            </span>
                                            <span className="ml-1 text-sm text-gray-500 truncate">
                                                {conv.lastMessage || 'Chưa có tin nhắn'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {conv.unreadCount > 0 && (
                                    <span className="bg-blue-500 text-white text-xs font-semibold rounded-full px-2 py-1 ml-2">
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default MenuMessage;