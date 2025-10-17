import { Navigate } from "react-router-dom";

const RoleBasedRedirect = () => {
  // Giả sử bạn lưu user đã login trong localStorage hoặc Redux
  const user = JSON.parse(localStorage.getItem("user")); // hoặc lấy từ Redux store

  if (!user) {
    // Nếu chưa đăng nhập, chuyển về login
    return <Navigate to="/" replace />;
  }

  // Điều hướng dựa trên role
  if (user.role === 1) {
    return <Navigate to="/recruiter/home" replace />;
  } else if (user.role === 2) {
    return <Navigate to="/" replace />;
  } else {
    // Nếu role không hợp lệ, chuyển về trang login
    return <Navigate to="/login" replace />;
  }
};

export default RoleBasedRedirect;
