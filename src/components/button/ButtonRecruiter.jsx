import { Link } from "react-router-dom";

const ButtonRecruiter = () => {
  return (
    <Link
      to="/"
      className="border-2 border-solid px-4 py-2 me-4 rounded-md ml-4 text-white bg-primary"
    >
      Đăng tuyển & tìm hồ sơ
    </Link>
  );
};

export default ButtonRecruiter;
