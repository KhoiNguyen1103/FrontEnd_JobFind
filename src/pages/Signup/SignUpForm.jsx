import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUser,
  faEnvelope,
  faPhone,
  faHome,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import authApi from "../../api/authApi";
import logo from "../../assets/logo.png";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import Spinner from "../../components/ui/Spinner";

const SignUpForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "Nguyễn Xuân",
    lastName: "Khôi",
    phone: "0147258369",
    address: "123 Gò Vấp, Hồ Chí Minh",
    email: "khoi@gmail.com",
    password: "StrongPass@123",
    confirmPassword: "StrongPass@123",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

  const validatePhone = (phone) =>
    phone.length === 10 && /^[0-9]+$/.test(phone);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!validatePhone(formData.phone))
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu và xác nhận không khớp";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const queryParams = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      password: formData.password,
      role: "JOBSEEKER",
    };

    try {
      setIsLoading(true);
      const response = await axiosClient.post("/auth/register", null, {
        params: queryParams,
      });

      if (!response) {
        alert(`Đăng ký thất bại: ${JSON.stringify(response.infoMessage)}`);
        return;
      }

      toast.success("Đăng ký thành công", { autoClose: 1500 });
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (error) {
      toast.error("Đăng ký thất bại", { autoClose: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
      <div>
        <img src={logo} alt="Logo" className="w-44 mx-auto object-contain" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-4xl border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Chào mừng bạn đến với JobFind
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Cùng xây dựng hồ sơ nổi bật và nhận cơ hội nghề nghiệp lý tưởng
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Họ và tên đệm */}
          <InputField
            icon={faUser}
            label="Họ và tên đệm"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          {/* Tên */}
          <InputField
            icon={faUser}
            label="Tên"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          {/* Số điện thoại */}
          <InputField
            icon={faPhone}
            label="Số điện thoại"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          {/* Địa chỉ */}
          <InputField
            icon={faHome}
            label="Địa chỉ"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          {/* Email */}
          <InputField
            icon={faEnvelope}
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
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

          {/* Xác nhận mật khẩu */}
          <InputField
            icon={faLock}
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
        </div>

        {/* Nút đăng ký */}
        <button
          type="submit"
          className="flex justify-center mx-auto mt-4 items-center bg-primary w-96 text-white py-2 rounded-md font-semibold hover:opacity-80 transition-all"
        >
          Đăng ký
          {isLoading && <Spinner />}
        </button>

        {/* Đã có tài khoản */}
        <div className="mt-6 flex justify-center">
          <p>
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng nhập
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
  value,
  onChange,
  error,
  type = "text",
}) => (
  <div>
    <label className="block mb-1 font-medium text-sm">
      {label} <span className="text-red-600">*</span>
    </label>
    <div className="flex items-center border border-slate-300 rounded-lg px-3 py-2">
      <FontAwesomeIcon icon={icon} className="text-primary mr-3" />
      <input
        type={type}
        name={name}
        placeholder={`Nhập ${label.toLowerCase()}`}
        className="w-full outline-none"
        value={value}
        onChange={onChange}
        required
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default SignUpForm;
