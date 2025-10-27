import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faMessage,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";

// import data
import navItems from "../data/header_submenu";
import { useSelector, useDispatch } from "react-redux";
// component
import MenuNotification from "../components/Menu/MenuNotification";
import MenuMessage from "../components/Menu/MenuMessage";
import MenuUser from "../components/Menu/MenuUser";
import conversationApi from "../api/conversationApi";
import { setTotalUnreadCount } from "../redux/slices/chatBoxSlice";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Lấy data từ redux
  const totalUnreadCount = useSelector(
    (state) => state.chatBox.totalUnreadCount
  );
  let user = useSelector((state) => state.auth.user);

  if (!user || user === null) {
    user = JSON.parse(localStorage.getItem("user"));
    // const token = JSON.parse(localStorage.getItem("token"));
  }
  const [isLogin, setIsLogin] = useState(!!user);

  useEffect(() => {
    setIsLogin(!!user); // Cập nhật trạng thái khi user hoặc token thay đổi
    if (user?.id) {
      conversationApi
        .countUnreadConversations(user.id)
        .then((response) => {
          // console.log("Total unread count:", response);
          dispatch(setTotalUnreadCount(response.data));
        })
        .catch((error) => console.error("Error fetching unread count:", error));
    }
  }, [user, dispatch]);

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

  // ==================== Sửa header cho từng role ====================
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

  // console.log(user.role);

  return (
    <div className=" header flex justify-between items-center px-4 font-medium shadow">
      <Link to="/" className="h-full">
        <img src={logo} alt="logo" className="h-full" />
      </Link>

      <ul className="flex grow justify-start items-center px-3">
        {navItems.map((item, index) => (
          <li key={index} className="nav-tab ps-4 pe-6 relative group">
            <button className="">
              <Link to={item.path ? item.path : ""}>{item.title}</Link>
            </button>

            {/* Submenu khi hover vào tab */}
            <ul className="submenu-item absolute left-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white shadow-lg transition-all duration-200 z-[999]">
              {item.subItems?.map((subItem, index) => (
                <li
                  key={index}
                  className="py-4 px-4 bg-slate-100 rounded-md mb-3"
                >
                  <Link>{subItem}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Nút đăng nhập - đăng ký - đăng tuyển */}
      {isLogin ? (
        // ============== Đã đăng nhập ===============
        <div className="button-group-login flex justify-end items-center">
          {/* Nút đăng tuyển và tìm hồ sơ */}
          <Link
            to={link}
            className="bg-primary border-2 border-solid px-4 py-2 me-4 rounded-md text-white"
          >
            {text}
          </Link>

          {/* ==================== thông báo =================== */}
          <div className="relative">
            <div
              className="btn-header"
              onClick={openModelNotification}
              ref={ref}
            >
              <FontAwesomeIcon icon={faBell} className="text-xl text-primary" />
            </div>

            {/* số lượng thông báo hiện có */}
            <div
              className="absolute top-0 right-4 p-2 bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
              style={{ width: "18px", height: "18px" }}
            >
              1
            </div>

            {/* model danh sách các thông báo */}
            {isOpenModelNotification && (
              <div
                className="absolute top-full right-0 mt-6 p-4 bg-white rounded-lg shadow-lg z-[999]"
                style={{ width: "300px" }}
              >
                <MenuNotification />
              </div>
            )}
          </div>
          {/* ==================== End: thông báo =================== */}

          {/* ==================== tin nhắn =================== */}
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
          {/* ==================== End: tin nhắn =================== */}

          {/* avatar */}
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
            {/* =================== Menu User ======================= */}
            {isOpenDropDownUserMenu && user && (
              <div
                className="absolute top-full right-0 mt-6 p-4 bg-white rounded-lg shadow-lg z-[999]"
                style={{ width: "400px" }}
              >
                <MenuUser user={user} isOpen={isOpenDropDownUserMenu} />
              </div>
            )}
            {/* =================== End: Menu User ======================= */}
          </div>
          {/* end: avatar */}
        </div>
      ) : (
        // ============== End: Đã đăng nhập ===============
        // Chưa đăng nhập
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
