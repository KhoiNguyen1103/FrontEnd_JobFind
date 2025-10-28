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
  // {
  //   title: "CV của tôi",
  //   icon: faFile,
  //   path: "/my-cv/1",
  // },
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
    title: "Thông tin cá nhân",
    icon: faPenToSquare,
    path: "/profile",
  },
  {
    title: "Đổi mật khẩu",
    icon: faLock,
    path: "/tai-khoan/mat-khau",
  },
];

const itemsForRecruiter = [
  {
    title: "Quản lý tài khoản",
    icon: faUser,
    path: "/recruiter/company-profile",
  },
  {
    title: "Quản lý tin tuyển dụng",
    icon: faTableColumns,
    path: "/recruiter/application",
  },
  {
    title: "Ứng viên ưa thích",
    icon: faHeart,
    path: "/recruiter/profile-saved",
  },
  {
    title: "Gói dịch vụ & Thanh toán",
    icon: faMoneyBill,
    path: "/recruiter/subscribe",
  },
  {
    title: "Thanh toán",
    icon: faCreditCard,
    path: "/recruiter/card",
  },
];

const DropDownUserMenu = ({ user, isOpen }) => {
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
            {role === "COMPANY" ? "Mã nhà tuyển dụng: " : "Mã ứng viên: "}{" "}
            <span className="text-slate-900">#{id}</span>{" "}
          </p>
        </div>
      </div>
      {/* ================ List chức năng trong menu ================ */}
      <div>
        {role === "JOBSEEKER"
          ? itemsForJobSeeker.map((item) => (
              <Link
                key={item.title}
                className="flex items-center py-4 px-4 rounded-lg mb-4 bg-slate-100"
                to={item.path}
                onClick={() => {
                  isOpen(false);
                }}
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
                onClick={() => {
                  isOpen(false);
                }}
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
  isOpen: PropTypes.bool.isRequired,
};

export default DropDownUserMenu;
