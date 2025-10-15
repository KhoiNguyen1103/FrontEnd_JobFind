import {
  faBriefcase,
  faFile,
  faHeart,
  faLock,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

const items = [
  {
    title: "CV của tôi",
    icon: faFile,
    path: "#",
  },
  {
    title: "Việc làm đã lưu",
    icon: faHeart,
    path: "/job-saved",
  },
  {
    title: "Việc làm đã ứng tuyển",
    icon: faBriefcase,
    path: "#",
  },
  {
    title: "Cài đặt thông tin cá nhân",
    icon: faPenToSquare,
    path: "/user-info/1",
  },
  {
    title: "Đổi mật khẩu",
    icon: faLock,
    path: "#",
  },
];

export default items;
