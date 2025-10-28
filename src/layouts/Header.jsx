import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faMessage,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import navItems from "../data/header_submenu";
import { useSelector, useDispatch } from "react-redux";
import MenuNotification from "../components/Menu/MenuNotification";
import MenuMessage from "../components/Menu/MenuMessage";
import MenuUser from "../components/Menu/MenuUser";
import WebSocketService from "../services/WebSocketService";
import conversationApi from "../api/conversationApi";
import notificationApi from "../api/notificationApi";
import { TOPICS } from "../data/topics";
import { setTotalUnreadCount } from "../redux/slices/chatBoxSlice";
import { setNotificationUnreadCount } from "../redux/slices/notificationSlice";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Lấy data từ redux
  const totalUnreadCount = useSelector((state) => state.chatBox.totalUnreadCount);
  const notificationUnreadCount = useSelector((state) => state.notification.notificationUnreadCount);
  let user = useSelector((state) => state.auth.user);

  if (!user || user === null) {
    user = JSON.parse(localStorage.getItem("user"));
  }
  const [isLogin, setIsLogin] = useState(!!user);

  useEffect(() => {
    setIsLogin(!!user);
    if (user?.id) {
      const wsService = WebSocketService.getInstance();
      if (!wsService.isConnected()) {
        wsService.connect(user.id);
      }

      // Subscribe tổng unread count (tin nhắn)
      const unreadCountTopic = TOPICS.UNREAD_COUNT(user.id.toString());
      const handleUnreadCountUpdate = (data) => {
        console.log(`📊 Nhận tổng unread count từ ${unreadCountTopic}:`, data);
        const count = typeof data === "number" ? data : 0;
        dispatch(setTotalUnreadCount(count));
      };
      wsService.subscribe(unreadCountTopic, handleUnreadCountUpdate);

      // Subscribe số thông báo chưa đọc
      const notificationTopic = TOPICS.NOTIFICATION(user.id.toString());
      const handleNotificationUnreadUpdate = (data) => {
        console.log(`📊 Nhận notification từ ${notificationTopic}:`, data);
        const unreadCount = typeof data.unreadCount === "number" ? data.unreadCount : notificationUnreadCount + 1;
        dispatch(setNotificationUnreadCount(unreadCount));
      };
      wsService.subscribe(notificationTopic, handleNotificationUnreadUpdate);

      // Lấy totalUnreadCount lần đầu từ API (tin nhắn)
      conversationApi
        .countUnreadConversations(user.id)
        .then((response) => {
          console.log("📥 Nhận totalUnreadCount từ API:", response);
          const count = typeof response === "number" ? response : 0;
          dispatch(setTotalUnreadCount(count));
        })
        .catch((error) => console.error("Error fetching unread count:", error));

      // Lấy notificationUnreadCount lần đầu từ API
      notificationApi
        .countUnreadNotifications(user.id)
        .then((response) => {
          console.log("📥 Nhận notificationUnreadCount từ API:", response);
          const count = typeof response === "number" ? response : 0;
          dispatch(setNotificationUnreadCount(count));
        })
        .catch((error) => console.error("Error fetching notification unread count:", error));

      return () => {
        wsService.unsubscribe(unreadCountTopic, handleUnreadCountUpdate);
        wsService.unsubscribe(notificationTopic, handleNotificationUnreadUpdate);
      };
    }
  }, [user, dispatch, notificationUnreadCount]);

  // Bật / tắt model thông báo
  const [isOpenModelNotification, setIsOpenModelNotification] = useState(false);
  const openModelNotification = () => {
    setIsOpenModelNotification(!isOpenModelNotification);
  };

  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpenModelNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Bật / tắt dropdown user menu
  const [isOpenDropDownUserMenu, setIsOpenDropDownUserMenu] = useState(false);
  const openDropDownUserMenu = () => {
    setIsOpenDropDownUserMenu(!isOpenDropDownUserMenu);
  };

  // Đóng MenuUser khi click bên ngoài
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpenDropDownUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isOpenModelMessage, setIsOpenModelMessage] = useState(false);
  const openModelMessage = () => {
    setIsOpenModelMessage(!isOpenModelMessage);
  };

  const messageRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setIsOpenModelMessage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sửa header cho từng role
  let text = "";
  let link = "#";
  if (user?.role === "JOBSEEKER") {
    text = "Bạn là nhà tuyển dụng?";
    link = "/recruiter/login";
  } else if (user?.role === "COMPANY" && location.pathname !== "/") {
    text = "Xem thị trường công việc";
    link = "/";
  } else if (user?.role === "COMPANY" && location.pathname === "/") {
    text = "Xem Profile đề cử";
    link = "/recruiter/home";
  }

  return (
    <div className="header flex justify-between items-center px-4 font-medium shadow">
      <Link to="/" className="h-full">
        <img src={logo} alt="logo" className="h-full" />
      </Link>

      <ul className="flex grow justify-start items-center px-3">
        {navItems.map((item, index) => (
          <li key={index} className="nav-tab ps-4 pe-6 relative group">
            <button>
              <Link to={item.path || ""}>{item.title}</Link>
            </button>

            {item.subItems?.length > 0 && (
              <ul className="submenu-item absolute left-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white shadow-lg transition-all duration-200 z-[999]">
                {item.subItems.map((subItem, subIndex) => (
                  <li
                    key={subIndex}
                    className="py-4 px-4 bg-slate-100 rounded-md mb-3"
                  >
                    <Link>{subItem}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {isLogin ? (
        <div className="button-group-login flex justify-end items-center">
          <Link
            to={link}
            className="bg-primary border-2 border-solid px-4 py-2 me-4 rounded-md text-white"
          >
            {text}
          </Link>

          {/* Notification Bell */}
          <div className="relative" ref={ref}>
            <div className="btn-header" onClick={openModelNotification}>
              <FontAwesomeIcon icon={faBell} className="text-xl text-primary" />
            </div>
            {notificationUnreadCount > 0 && (
              <div
                className="absolute top-0 right-3 bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                style={{ width: "18px", height: "18px" }}
              >
                {notificationUnreadCount}
              </div>
            )}
            {isOpenModelNotification && (
              <div
                className="absolute top-full right-0 mt-6 p-4 bg-white rounded-lg shadow-lg z-[999]"
                style={{ width: "300px" }}
              >
                <MenuNotification />
              </div>
            )}
          </div>

          {/* Message Icon */}
          <div className="relative" ref={messageRef}>
            <div
              className="btn-header p-2 hover:bg-gray-100 rounded-full cursor-pointer"
              onClick={openModelMessage}
            >
              <FontAwesomeIcon
                icon={faMessage}
                className="text-xl text-primary"
              />
            </div>
            {totalUnreadCount > 0 && (
              <div
                className="absolute top-0 right-3 bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
                style={{ width: "18px", height: "18px" }}
              >
                {totalUnreadCount}
              </div>
            )}
            {isOpenModelMessage && (
              <div className="absolute top-full right-0 mt-6 p-4 bg-white rounded-lg shadow-lg z-[999] w-[360px]">
                <MenuMessage
                  userId={user?.id}
                  onClose={() => setIsOpenModelMessage(false)}
                />
              </div>
            )}
          </div>

          {/* User Avatar + Dropdown */}
          <div
            className="relative flex items-center justify-center cursor-pointer"
            ref={menuRef}
          >
            <div className="pe-4 p-1" onClick={openDropDownUserMenu}>
              <img
                src={user?.avatar || "/image_user_default.jpg"}
                alt="avatar"
                className="w-12 h-12 rounded-full border-gray-300 border-[1px]"
              />
            </div>
            <FontAwesomeIcon
              icon={faAngleDown}
              className="text-lg text-primary"
            />
            {isOpenDropDownUserMenu && user && (
              <div
                className="absolute top-full right-0 mt-6 p-4 bg-white rounded-lg shadow-lg z-[999]"
                style={{ width: "400px" }}
              >
                <MenuUser user={user} isOpen={isOpenDropDownUserMenu} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="button-group-login flex justify-end items-center">
          <Link
            to="/login"
            className="btn-login border-solid border-2 rounded-md px-4 py-2 ml-4"
          >
            Đăng nhập
          </Link>
          <Link
            to="/signup"
            className="btn-signup border-2 border-solid px-4 py-2 rounded-md ml-4 text-white"
          >
            Đăng ký
          </Link>
          <Link
            to="/overview"
            className="header-button border-2 border-solid px-4 py-2 rounded-md ml-4 text-white"
          >
            Đăng tuyển & tìm hồ sơ
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;