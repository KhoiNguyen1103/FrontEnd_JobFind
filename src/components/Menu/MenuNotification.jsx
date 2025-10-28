import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import notificationApi from "../../api/notificationApi";
import WebSocketService from "../../services/WebSocketService";
import ApplicationModalJSK from "./ApplicationModalJSK";
import { formatDateTime } from "../../untils/formatDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { TOPICS } from "../../data/topics";
import { setNotificationUnreadCount } from "../../redux/slices/notificationSlice";

const ModelNotification = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const notificationUnreadCount = useSelector((state) => state.notification.notificationUnreadCount);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const user = useSelector((state) => state.auth?.user);
  const userId = user?.id;
  const userRole = user?.role;

  const formatNotificationContent = (notification) => {
    const jobTitle = notification.jobTitle || "Đơn ứng tuyển";
    const status = notification.content || "Không xác định";
    return `Đơn ứng tuyển "${jobTitle}" đã chuyển sang trạng thái "${getStatusText(status)}"`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'INTERVIEWING':
        return 'Đang phỏng vấn';
      case 'PENDING':
        return 'Đang chờ';
      case 'HIRED':
        return 'Đã thuê';
      case 'REJECTED':
        return 'Đã từ chối';
      case 'REVIEWING':
        return 'Đang xem xét';
      case 'SHORTLISTED':
        return 'Danh sách sơ tuyển';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (!userId) return;

    const wsService = WebSocketService.getInstance();
    wsService.connect(userId);

    const notificationTopic = TOPICS.NOTIFICATION(userId.toString());
    wsService.subscribe(notificationTopic, (data) => {
      console.log("Received notification:", data);
      setNotifications((prev) => [data, ...prev]);
      const unreadCount = typeof data.unreadCount === "number" ? data.unreadCount : notificationUnreadCount + 1;
      dispatch(setNotificationUnreadCount(unreadCount));
    });

    return () => {
      wsService.unsubscribe(notificationTopic, () => { });
      wsService.disconnect();
    };
  }, [userId, dispatch, notificationUnreadCount]);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const notificationsResponse = await notificationApi.getNotificationsByUserId(userId);
        setNotifications(Array.isArray(notificationsResponse) ? notificationsResponse : []);
        const unreadResponse = await notificationApi.countUnreadNotifications(userId);
        const unreadCount = typeof unreadResponse === "number" ? unreadResponse : 0;
        dispatch(setNotificationUnreadCount(unreadCount));
      } catch (error) {
        console.error("Error fetching notifications:", error);
        dispatch(setNotificationUnreadCount(0));
      }
    };

    fetchNotifications();
  }, [userId, dispatch]);

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead(userId);
      setNotifications((prev) =>
        prev.map((noti) => ({ ...noti, isRead: true }))
      );
      dispatch(setNotificationUnreadCount(0));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    console.log("Clicked notification:", notification);
    if (!notification.isRead) {
      try {
        await notificationApi.markAsRead(notification.notiId);
        setNotifications((prev) =>
          prev.map((noti) =>
            noti.notiId === notification.notiId ? { ...noti, isRead: true } : noti
          )
        );
        dispatch(setNotificationUnreadCount(Math.max(0, notificationUnreadCount - 1)));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    setSelectedApplicationId(notification.applicationId);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-4 border-b border-solid border-slate-500">
        <p className="text-lg font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faBell} className="text-blue-600" />
          Thông báo
          {notificationUnreadCount > 0 && (
            <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-2">
              {notificationUnreadCount}
            </span>
          )}
        </p>
        <button
          onClick={markAllAsRead}
          className="text-blue-600 font-light text-md hover:underline"
        >
          Đánh dấu đã đọc
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.notiId}
              className={`mt-2 p-4 cursor-pointer hover:bg-gray-100 rounded-lg shadow-sm transition 
                ${notification.isRead ? "opacity-75 bg-white" : "font-semibold bg-green-100"}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <p className="pb-1">{formatNotificationContent(notification)}</p>
              <p className="text-sm text-gray-500">
                {formatDateTime(notification.createdAt)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 py-4 text-center">Không có thông báo nào.</p>
        )}
      </div>
      {isModalOpen && (
        <ApplicationModalJSK
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          applicationId={selectedApplicationId}
          userRole={userRole}
          getStatusColor={(status) => {
            switch (status) {
              case "INTERVIEWING":
                return "bg-blue-300";
              case "PENDING":
                return "bg-yellow-300";
              case "HIRED":
                return "bg-green-200";
              case "REJECTED":
                return "bg-red-300";
              case "REVIEWING":
                return "bg-pink-300";
              default:
                return "bg-gray-300";
            }
          }}
          getStatusIcon={() => faCalendarAlt}
          getStatusText={getStatusText}
          getAvailableStatuses={(currentStatus) => {
            const statuses = ["PENDING", "REVIEWING", "INTERVIEWING", "HIRED", "REJECTED"];
            return statuses.filter((status) => status !== currentStatus);
          }}
          formatDate={(date) => new Date(date).toLocaleDateString("vi-VN")}
          formatDateTime={(date) =>
            new Date(date).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          calculateDuration={(start, end) => {
            const startDate = new Date(start);
            const endDate = end ? new Date(end) : new Date();
            const months =
              (endDate.getFullYear() - startDate.getFullYear()) * 12 +
              (endDate.getMonth() - startDate.getMonth());
            return months > 0 ? `${months} tháng` : "Dưới 1 tháng";
          }}
        />
      )}
    </div>
  );
};

export default ModelNotification;