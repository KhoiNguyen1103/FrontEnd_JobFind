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

  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
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

      toast.success("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      dispatch(logout());
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div className="bg-gray-100 p-6 max-w-lg mx-auto my-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        Thay đổi mật khẩu đăng nhập
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">
            Email đăng nhập
          </label>
          <input
            type="email"
            value="nhatnguyen15062019@gmail.com"
            className="w-full p-2 border rounded bg-gray-200"
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded bg-blue-100"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">
            Mật khẩu mới
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">
            Nhập lại mật khẩu mới
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white font-semibold p-2 rounded w-full hover:bg-green-600"
        >
          Lưu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
