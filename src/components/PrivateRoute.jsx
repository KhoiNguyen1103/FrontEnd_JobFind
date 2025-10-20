// components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ children, allowedRoles }) => {
  const currentUser = useSelector((state) => state.auth.user); // lấy user từ redux hoặc context
  // console.log(currentUser);

  if (!currentUser) {
    // Nếu chưa đăng nhập, redirect về login
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Nếu đăng nhập nhưng role không phù hợp, redirect về trang 403 hoặc home
    return <Navigate to="/" replace />;
  }

  // Nếu hợp lệ, cho vào trang
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;
