import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faEnvelope,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import authApi from "../../api/authApi";
import { toast } from "react-toastify";
import { login } from "../../redux/slices/authSlice";
import Spinner from "../../components/ui/Spinner";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Theo dõi trạng thái form
  const [formData, setFormData] = useState({
    email: "nguyenvanan@gmail.com",
    // password: "StrongPass@123",
    password: "Test#123",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const user = await authApi.login(formData);
      // console.log("Login response:", user);
      toast.success("Đăng nhập thành công!", { autoClose: 2000 });

      // Lưu thông tin người dùng vào localStorage
      // localStorage.setItem("user", JSON.stringify(response));
      // localStorage.setItem("token", response.token);
      dispatch(login(user));
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.", {
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
      <div>
        <img src={logo} alt="Logo" className="w-40 mx-auto object-contain" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-primary">
          Chào mừng bạn đã quay trở lại
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý
          tưởng
        </p>

        {/* Email */}
        <InputField
          icon={faEnvelope}
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Mật khẩu */}
        <InputField
          icon={faLock}
          label="Mật khẩu"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="text-right text-sm mb-4">
          <Link to="/" className="text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          className="flex justify-center items-center bg-primary w-96 text-white py-2 rounded-md font-semibold hover:opacity-80 transition-all"
        >
          Đăng nhập
          {isLoading && <Spinner />}
        </button>

        <div className="mt-6 flex justify-center">
          <p>
            Chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng ký
            </Link>
          </p>
        </div>

        <div className="mt-6 flex justify-center items-center">
          <Link to="/" className=" font-medium">
            Tới trang công việc
          </Link>
          <FontAwesomeIcon icon={faArrowRight} className="ps-2" />
        </div>
      </form>
    </div>
  );
};

const InputField = ({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
}) => (
  <div className="flex flex-col gap-1 pb-4">
    <label className="font-medium">{label}</label>
    <div className="flex items-center border border-slate-300 rounded-lg px-3 py-2">
      <FontAwesomeIcon icon={icon} className="text-primary me-3" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full outline-none"
        placeholder={`Nhập ${label.toLowerCase()}`}
      />
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default LoginForm;
