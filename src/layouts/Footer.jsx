import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-12">
      <div className="w-full">
        {/* Hero Footer */}
        <div className="bg-gradient-to-r from-green-50 to-white rounded-2xl shadow-md p-8 text-center">
          <Link to="/">
            <img src={logo} alt="JobFind Logo" className="h-28 mx-auto mb-4" />
          </Link>
          <p className="text-gray-600 text-lg mb-4">
            Kết nối cơ hội, xây dựng sự nghiệp với JobFind
          </p>
          <div className="flex justify-center space-x-6 text-gray-600">
            <p>
              <strong>Hotline:</strong>{" "}
              <a href="tel:0123456789" className="text-primary hover:underline">
                0999 999 999
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:hotro@JobFind.vn"
                className="text-primary hover:underline"
              >
                lienhe@JobConnect.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
