import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between">
          {/* Logo và liên hệ */}
          <div className="w-[40%] md:w-1/6 mb-4 md:mb-0 pe-4">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
            <div className="mt-4">
              <p className="text-gray-700 text-lg">
                <strong>Hotline:</strong> 0123 456 789
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Email:</strong>{" "}
                <Link href="mailto:hotro@findjob.com" className="text-blue-500">
                  hotro@topcv.vn
                </Link>
              </p>
            </div>
          </div>

          {/* Các cột danh mục */}
          <div className="col-index w-full md:w-3/4 flex flex-wrap ps-12">
            {/* Cột Về FindJob */}
            <div className="w-1/3 md:w-1/4 mb-4 md:mb-0">
              <h3 className="font-semibold text-gray-800 mb-2">Về TopCV</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <Link to="/">Giới thiệu</Link>
                </li>
                <li>
                  <Link to="/">Góc báo chí</Link>
                </li>
                <li>
                  <Link to="/">Tuyển dụng</Link>
                </li>
                <li>
                  <Link to="/">Liên hệ</Link>
                </li>
              </ul>
            </div>

            {/* Cột Hồ sơ và CV */}
            <div className="w-1/3 md:w-1/4 mb-4 md:mb-0">
              <h3 className="font-semibold text-gray-800 mb-2">Hồ sơ và CV</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <Link to="/">Quản lý CV của bạn</Link>
                </li>
                <li>
                  <Link to="/">TopCV Profile</Link>
                </li>
                <li>
                  <Link to="/">Hướng dẫn viết CV</Link>
                </li>
              </ul>
            </div>

            {/* Cột Khám phá */}
            <div className="w-1/3 md:w-1/4 mb-4 md:mb-0">
              <h3 className="font-semibold text-gray-800 mb-2">Khám phá</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <Link to="/">Ứng dụng di động TopCV</Link>
                </li>
                <li>
                  <Link to="/">Tính lương Gross - Net</Link>
                </li>
                <li>
                  <Link to="/">Tính lãi suất kép</Link>
                </li>
              </ul>
            </div>

            {/* Cột Xây dựng sự nghiệp */}
            <div className="w-1/3 md:w-1/4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Xây dựng sự nghiệp
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <Link to="/">Việc làm tốt nhất</Link>
                </li>
                <li>
                  <Link to="/">Việc làm lương cao</Link>
                </li>
                <li>
                  <Link to="/">Việc làm IT</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
