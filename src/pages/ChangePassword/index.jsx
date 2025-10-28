import { useState } from "react";
import userApi from "../../api/userApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({}); // Lưu lỗi validate

  const user = useSelector((state) => state.auth.user);

  // Hàm validate dữ liệu
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra trường rỗng
    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    if (!newPassword.trim()) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu mới";
    }

    // Kiểm tra độ dài và định dạng mật khẩu mới
    if (newPassword && newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
    } else if (newPassword && !/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "Mật khẩu mới phải chứa ít nhất một chữ cái in hoa";
    } else if (newPassword && !/[0-9]/.test(newPassword)) {
      newErrors.newPassword = "Mật khẩu mới phải chứa ít nhất một số";
    } else if (newPassword && !/[!@#$%^&*]/.test(newPassword)) {
      newErrors.newPassword = "Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt";
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp nhau không
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu mới và xác nhận mật khẩu không khớp";
    }

    // Kiểm tra mật khẩu mới không được trùng với mật khẩu hiện tại
    if (newPassword && currentPassword && newPassword === currentPassword) {
      newErrors.newPassword = "Mật khẩu mới không được trùng với mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra validate trước khi gửi
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào!", { autoClose: 500 });
      return;
    }

    // Gửi yêu cầu thay đổi mật khẩu lên server
    try {
      await userApi.changePassword({
        userId: user.id,
        oldPassword: currentPassword,
        newPassword: newPassword,
        changeType: "UPDATE",
      });

      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại." , { autoClose: 500 });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      dispatch(logout()); // Đăng xuất sau khi đổi mật khẩu thành công
    } catch (error) {
      // Xử lý lỗi từ server
      toast.error("Sai mật khẩu cũ!" , { autoClose: 500 });
      console.error("Lỗi đổi mật khẩu:", error);
    }
  };

  return (
    <div className="bg-gray-100 p-6 max-w-lg mx-auto my-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Thay đổi mật khẩu đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Email đăng nhập</label>
          <input
            type="email"
            value={user.email}
            className="w-full p-2 border rounded bg-gray-200"
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Mật khẩu hiện tại</label>
          <input
            type="password"
            className={`w-full p-2 border rounded ${errors.currentPassword ? "border-red-500" : "border-gray-300"} bg-blue-100`}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
          )}
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Mật khẩu mới</label>
          <input
            type="password"
            className={`w-full p-2 border rounded ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Nhập lại mật khẩu mới</label>
          <input
            type="password"
            className={`w-full p-2 border rounded ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white font-semibold p-2 rounded w-full hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Lưu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;