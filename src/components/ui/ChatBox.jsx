import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import conversationApi from '../../api/conversationApi';
import awsS3Api from '../../api/awsApi';
import { setConversationId, minimizeChatBox, maximizeChatBox, closeChatBox, setTotalUnreadCount, } from '../../redux/slices/chatBoxSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faTimes, faExpand, faPaperclip, faPaperPlane, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import WebSocketService from '../../services/WebSocketService';
import { TOPICS } from '../../data/topics';

const ChatBox = ({ profileId, userId, displayName, conversationId, isMinimized, index }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [conversationInfo, setConversationInfo] = useState(null);
    const [initialUnreadCount, setInitialUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();
    const hasMarkedAsRead = useRef(false);
    const hasMinimizedOnce = useRef(false);
    const wsService = WebSocketService.getInstance();

    useEffect(() => {
        if (!user?.id) {
            console.error('User ID is missing');
            setLoading(false);
            return;
        }

        if (!conversationId) {
            setLoading(false);
            return;
        }

        if (!wsService.isConnected()) {
            wsService.connect(user.id, [conversationId]);
        } else {
            wsService.subscribeToConversation(conversationId);
        }

        const conversationTopic = TOPICS.CONVERSATION(conversationId.toString());

        const handleNewMessage = (data) => {
            setMessages((prevMessages) => {
                if (prevMessages.some((msg) => msg.messageId === data.messageId)) {
                    return prevMessages;
                }
                return [...prevMessages, data];
            });
        };

        const metaTopic = TOPICS.CONVERSATION_DATA(conversationId.toString());
        const handleMetaUpdate = (data) => {
            setConversationInfo(data);
            setInitialUnreadCount(data.unreadCount || 0);
        };
        wsService.subscribe(metaTopic, handleMetaUpdate);
        wsService.subscribe(conversationTopic, handleNewMessage);

        const fetchConversationData = async () => {
            try {
                setLoading(true);
                const convResponse = await conversationApi.getConversationById(conversationId, user.id);
                setConversationInfo(convResponse || {});
                setInitialUnreadCount(convResponse?.unreadCount || 0);

                const messagesResponse = await conversationApi.getMessagesByConversationId(conversationId);
                setMessages(messagesResponse || []);

                wsService.sendMessage('/app/messages/read', {
                    conversationId,
                    userId: user.id,
                });
            } catch (error) {
                console.error('Error fetching conversation data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversationData();
        return () => {
            wsService.unsubscribe(conversationTopic, handleNewMessage);
            wsService.unsubscribe(metaTopic, handleMetaUpdate);
        };
    }, [conversationId, user?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        hasMarkedAsRead.current = false;
        hasMinimizedOnce.current = false;
        setInitialUnreadCount(0);
    }, [conversationId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!user?.id || (!newMessage.trim() && !selectedFile)) return;

        setUploading(true);
        try {
            let currentConversationId = conversationId;

            if (!currentConversationId) {
                if (user.role === 'COMPANY') {
                    const conversationResponse = await conversationApi.createConversation(userId, user.id);
                    currentConversationId = conversationResponse.conversationId;
                    console.log(`✅ Tạo conversation mới: conversationId ${currentConversationId}`);
                    dispatch(setConversationId({ profileId, conversationId: currentConversationId }));

                    const convResponse = await conversationApi.getConversationById(
                        currentConversationId,
                        user.id
                    );
                    setConversationInfo(convResponse || {});
                    wsService.subscribeToConversation(currentConversationId);
                } else {
                    throw new Error('Không thể tạo conversation: Vai trò người dùng không hợp lệ');
                }
            }

            let destination;
            let payload;
            let fileData = null;

            if (selectedFile) {
                const fileRequest = {
                    fileName: selectedFile.name,
                    contentType: selectedFile.type,
                };
                const { url } = await awsS3Api.getPresignedUrl(fileRequest);

                const uploadResponse = await fetch(url, {
                    method: 'PUT',
                    body: selectedFile,
                    headers: {
                        'Content-Type': selectedFile.type,
                    },
                });

                fileData = {
                    fileName: selectedFile.name,
                    fileType: selectedFile.type,
                    filePath: url.split('?')[0],
                };
            }

            if (selectedFile) {
                destination = '/app/message/file';
                payload = {
                    conversationId: currentConversationId,
                    senderId: user.id,
                    content: newMessage.trim() || null,
                    fileName: fileData.fileName,
                    fileType: fileData.fileType,
                    filePath: fileData.filePath,
                };
            } else {
                destination = '/app/message/text';
                payload = {
                    conversationId: currentConversationId,
                    senderId: user.id,
                    content: newMessage.trim(),
                };
            }

            const sent = wsService.sendMessage(destination, payload);
            if (!sent) {
                throw new Error(`Gửi tin nhắn qua WebSocket tới ${destination} thất bại`);
            }

            setNewMessage('');
            setSelectedFile(null);
            fileInputRef.current.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleMarkAsRead = () => {
        if (!hasMarkedAsRead.current && conversationId && initialUnreadCount > 0) {
            const wsService = WebSocketService.getInstance();
            wsService.sendMessage('/app/messages/read', {
                conversationId,
                userId: user.id,
            });
            hasMarkedAsRead.current = true;
            setInitialUnreadCount(0);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        fileInputRef.current.value = '';
    };

    const handleMinimize = () => {
        if (!hasMinimizedOnce.current) {
            hasMinimizedOnce.current = true;
            setConversationInfo(prev => ({ ...prev, unreadCount: 0 }));
        }
        dispatch(minimizeChatBox({ profileId, conversationId }));
    };

    const handleMaximize = async () => {
        dispatch(maximizeChatBox({ profileId, conversationId }));
        if (hasMarkedAsRead.current && conversationId) {
            setConversationInfo(prev => ({
                ...prev,
                unreadCount: 0,
            }));
        }
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

    const handleClose = () => {
        dispatch(closeChatBox({ conversationId }));
    };

    if (!user?.id) {
        return null;
    }

    const groupMessagesByDate = (messages) => {
        return messages.reduce((acc, msg) => {
            const date = new Date(msg.sentAt).toISOString().split("T")[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(msg);
            return acc;
        }, {});
    };

    const groupedMessages = groupMessagesByDate(messages);
    let globalIndex = 0;
    const allMessages = Object.entries(groupedMessages).flatMap(([_, msgs]) => msgs);
    const messagesFromOthers = allMessages.filter(msg => msg.senderId !== user.id);
    const unreadStartIndexInOthers = messagesFromOthers.length - initialUnreadCount;
    const unreadStartMessageId = messagesFromOthers[unreadStartIndexInOthers]?.messageId;

    const chatDisplayName = conversationInfo?.senderName || displayName;

    return createPortal(
        <div
            className={`fixed bottom-1 right-4 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-[1000] transition-all duration-300 ${isMinimized ? 'h-12' : 'h-[450px]'
                }`}
            style={{ right: `${4 + index * 320}px` }}
        >
            <div className="flex items-center justify-between p-3 bg-green-600 text-white rounded-t-xl">
                <div className="flex items-center space-x-2">
                    <span
                        className="text-sm font-semibold truncate max-w-[200px] hover:cursor-pointer"
                        onClick={() => navigate(`/job-seeker-profile/${conversationInfo?.roleId || profileId}`)}
                    >
                        {chatDisplayName}
                    </span>
                    {initialUnreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                            {initialUnreadCount}
                        </span>
                    )}
                </div>
                <div className="flex space-x-3">
                    {isMinimized ? (
                        <button onClick={handleMaximize} className="text-white hover:text-gray-200">
                            <FontAwesomeIcon icon={faExpand} />
                        </button>
                    ) : (
                        <button onClick={handleMinimize} className="text-white hover:text-gray-200">
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                    )}
                    <button onClick={handleClose} className="text-white hover:text-gray-200">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
            {!isMinimized && (
                <>
                    <div className="flex-1 p-4 overflow-y-auto h-[calc(450px-120px)] bg-gray-50">
                        {loading ? (
                            <div className="text-center text-gray-500 flex items-center justify-center h-full">
                                <svg
                                    className="animate-spin h-6 w-6 text-green-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                    ></path>
                                </svg>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-gray-500">Chưa có tin nhắn</div>
                        ) : (
                            Object.entries(groupedMessages).map(([date, messages]) => (
                                <div key={date}>
                                    <div className="text-center my-3 text-xs text-gray-500">
                                        {new Date(date).toLocaleDateString('vi-VN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </div>
                                    {messages.map(msg => {
                                        const showUnreadSeparator = msg.messageId === unreadStartMessageId;
                                        const messageBlock = (
                                            <div
                                                key={msg.messageId}
                                                className={`mb-3 flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'
                                                    } items-start space-x-2`}
                                            >
                                                <div
                                                    className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === user.id
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-200 text-black'
                                                        }`}
                                                >
                                                    {msg.content && (
                                                        <div className="text-sm break-words whitespace-pre-wrap">{msg.content}</div>
                                                    )}
                                                    {msg.attachment && (
                                                        <div className="mt-2">
                                                            {msg.attachment.fileType?.startsWith('image/') ? (
                                                                <img
                                                                    src={msg.attachment.filePath}
                                                                    alt={msg.attachment.fileName}
                                                                    className="max-w-full max-h-48 rounded-md border border-gray-300 hover:cursor-pointer"
                                                                    onClick={() => setPreviewImage(msg.attachment.filePath)}
                                                                />
                                                            ) : (
                                                                <a
                                                                    href={msg.attachment.filePath}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center space-x-2 text-sm text-purple-800 underline"
                                                                >
                                                                    <FontAwesomeIcon icon={faFileAlt} className="text-purple-600" />
                                                                    <span className="break-all max-w-[180px]">{msg.attachment.fileName}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        {new Date(msg.sentAt).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                        );

                                        const result = (
                                            <React.Fragment key={msg.messageId}>
                                                {showUnreadSeparator && (
                                                    <div className="text-center my-4 text-xs text-gray-500 relative">
                                                        <div className="border-t border-gray-300 absolute left-0 right-0 top-1/2 z-0"></div>
                                                        <span className="bg-gray-100 px-2 z-10 relative">Tin chưa đọc</span>
                                                    </div>
                                                )}
                                                {messageBlock}
                                            </React.Fragment>
                                        );

                                        globalIndex += 1;
                                        return result;
                                    })}
                                </div>
                            ))

                        )}
                        {selectedFile && (
                            <div className="flex items-center justify-between bg-gray-200 p-2 rounded-md">
                                <span className="text-sm text-gray-600 break-all max-w-[200px]">
                                    {selectedFile.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form
                        onSubmit={handleSendMessage}
                        className="p-3 border-t bg-white flex flex-col space-y-2"
                    >

                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="text-gray-500 hover:text-green-600"
                                disabled={uploading}
                            >
                                <FontAwesomeIcon icon={faPaperclip} size="lg" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx"
                            />
                            <textarea
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onFocus={handleMarkAsRead}
                                placeholder="Nhập tin nhắn..."
                                rows={1}
                                className="flex-1 resize-none p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 max-h-[6rem] overflow-y-auto"
                                disabled={uploading}
                            />
                            <div className="flex justify-end">
                                {uploading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-green-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <button
                                        type="submit"
                                        className={`text-green-600 hover:text-green-700 ${(!newMessage.trim() && !selectedFile)
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                            }`}
                                        disabled={!newMessage.trim() && !selectedFile}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                                    </button>
                                )}
                            </div>

                        </div>
                        {previewImage && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[2000]"
                                onClick={() => setPreviewImage(null)}
                            >
                                <img
                                    src={previewImage}
                                    alt="preview"
                                    className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
                                />
                            </div>
                        )}

                    </form>
                </>
            )}
        </div>,
        document.getElementById('chatbox-root')
    )
};

export default ChatBox; 