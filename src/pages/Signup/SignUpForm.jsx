import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faEnvelope, faPhone, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import registerUser from "../../services/registerService";
import logo from "../../assets/logo.png";

const SignUpForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

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
    if (!validatePhone(formData.phone)) newErrors.phone = "Số điện thoại phải có 10 chữ số";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu và xác nhận không khớp";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...formData,
      role: "JOBSEEKER",
    };
    delete payload.confirmPassword;

    const response = await registerUser(payload);
    if (!response.success) {
      alert(`Đăng ký thất bại: ${response.message}`);
      return;
    }

    alert("Đăng ký thành công!");
    navigate("/login", { replace: true });
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

        {/* Chính sách */}
        <div className="flex items-start gap-2 text-sm mt-4">
          <input type="checkbox" className="mt-1" required />
          <p>
            Tôi đồng ý với{" "}
            <Link to="/" className="text-primary underline">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link to="/" className="text-primary underline">
              Chính sách bảo mật
            </Link>
            .
          </p>
        </div>

        {/* Nút đăng ký */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-14 py-2 rounded-md font-semibold hover:bg-green-700"
          >
            Đăng ký
          </button>
        </div>

        {/* Hoặc đăng ký bằng */}
        <p className="text-center text-gray-400 my-4">Hoặc đăng ký bằng</p>
        <div className="flex gap-4">
          <Link className="flex-1 bg-[#e73b2f] text-white py-2 rounded-lg flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faGoogle} />
            Google
          </Link>
          <Link className="flex-1 bg-[#1877f2] text-white py-2 rounded-lg flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faSquareFacebook} />
            Facebook
          </Link>
        </div>

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
      </form>

      <style>{`
        .input {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          width: 100%;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

const InputField = ({ icon, label, name, value, onChange, error, type = "text" }) => (
  <div>
    <label className="block mb-1 font-medium text-sm">{label} <span className="text-red-600">*</span></label>
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
