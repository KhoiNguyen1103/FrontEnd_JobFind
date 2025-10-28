import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
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
              <a href="tel:0123456789" className="text-green-500 hover:underline">
                0123 456 789
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:hotro@JobFind.vn"
                className="text-green-500 hover:underline"
              >
                hotro@JobFind.vn
              </a>
            </p>
          </div>
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4 mt-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600 transition"
            >
              <FontAwesomeIcon icon={faFacebook} className="text-xl" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600 transition"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-xl" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600 transition"
            >
              <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600 transition"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-xl" />
            </a>
          </div>
          <div className="text-center text-sm text-gray-500 mt-8">
            © 2025 JobFind. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;