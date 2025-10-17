import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import {
  faBuilding,
  faCreditCard,
  faMoneyBill,
  faRightFromBracket,
  faTableColumns,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  faBriefcase,
  faFile,
  faHeart,
  faLock,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

const itemsForJobSeeker = [
  {
    title: "CV của tôi",
    icon: faFile,
    path: "/my-cv/1",
  },
  {
    title: "Việc làm đã lưu",
    icon: faHeart,
    path: "/job-saved",
  },
  {
    title: "Việc làm đã ứng tuyển",
    icon: faBriefcase,
    path: "/job-applied",
  },
  {
    title: "Cài đặt thông tin cá nhân",
    icon: faPenToSquare,
    path: "/user-info/1",
  },
  {
    title: "Đổi mật khẩu",
    icon: faLock,
    path: "/tai-khoan/mat-khau",
  },
];

const itemsForRecruiter = [
  {
    title: "Quản lý tin tuyển dụng",
    icon: faTableColumns,
    path: "/",
  },
  {
    title: "Thông tin công ty",
    icon: faBuilding,
    path: "/",
  },
  {
    title: "Gói dịch vụ & Thanh toán",
    icon: faMoneyBill,
    path: "/",
  },
  {
    title: "Thêm thẻ thanh toán",
    icon: faCreditCard,
    path: "/",
  },
  {
    title: "Quản lý tài khoản",
    icon: faUser,
    path: "/",
  },
];

const DropDownUserMenu = ({ user }) => {
  const dispatch = useDispatch();
  const { username, id, avatar, role } = user;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="font-normal">
      {/* ============ header ============ */}
      <div className="flex items-center pb-4">
        <div className="pe-4 p-1">
          <img src={avatar} alt="logo" className=" w-12 h-12 rounded-full" />
        </div>
        <div>
          <p className="font-bold text-lg">{username}</p>
          <p className="text-slate-400">
            {role === 1 ? "Mã nhà tuyển dụng: " : "Mã ứng viên: "}{" "}
            <span className="text-slate-900">#{id}</span>{" "}
          </p>
        </div>
      </div>
      {/* ================ List chức năng trong menu ================ */}
      <div>
        {role === 2
          ? itemsForJobSeeker.map((item) => (
              <Link
                key={item.title}
                className="flex items-center py-4 px-4 rounded-lg mb-4 bg-slate-100"
                to={item.path}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="pe-4 text-lg text-primary"
                />
                <p>{item.title}</p>
              </Link>
            ))
          : itemsForRecruiter.map((item) => (
              <Link
                key={item.title}
                className="flex items-center py-4 px-4 rounded-lg mb-4 bg-slate-100"
                to={item.path}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="pe-4 text-lg text-primary"
                />
                <p>{item.title}</p>
              </Link>
            ))}

        {/* Đăng xuất */}
        <div
          className="flex items-center py-4 px-4 rounded-lg mb-4 bg-slate-100"
          onClick={handleLogout}
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="pe-4 text-lg text-primary"
          />
          <p className="text-red-500">Đăng xuất</p>
        </div>
      </div>
      {/* ================ End: List chức năng trong menu ================ */}
    </div>
  );
};
DropDownUserMenu.propTypes = {
  user: PropTypes.object.isRequired,
};

export default DropDownUserMenu;
