import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";

import { useState } from "react";

// api
import registerUser from "../../services/registerService";

const SignUpForm = () => {
  const navigate = useNavigate();

  // Theo dõi trạng thái form
  const [formData, setFormData] = useState({
    firstName: "Nguyễn Minh",
    lastName: "Nhật",
    phone: "0123456789",
    address: "Hà Nội",
    email: "nhat@gmail.com",
    password: "StrongPass@123",
    confirmPassword: "StrongPass@123",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Kiểm tra email hợp lệ
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  // Kiểm tra số điện thoại có 10 chữ số
  const validatePhone = (phone) => {
    return phone.length === 10 && /^[0-9]+$/.test(phone);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // call api đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Kiểm tra email
    if (!validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    } else {
      newErrors.email = "";
    }

    // Kiểm tra số điện thoại
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    } else {
      newErrors.phone = "";
    }

    // Cập nhật trạng thái lỗi
    setErrors(newErrors);

    const { confirmPassword, ...rest } = formData;

    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp";
    } else {
      newErrors.confirmPassword = "";
    }

    const payload = {
      ...rest,
      role: "JOBSEEKER",
    };

    // Nếu có lỗi, không gửi form
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    const response = await registerUser(payload);
    if (!response.success) {
      alert(`Đăng ký thất bại: ${response.message}`);
      return;
    }

    console.log("Đăng ký thành công:", response.data);
    alert("Đăng ký thành công!");
    // Chuyển hướng đến trang đăng nhập
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto pt-6">
      <p className="text-2xl text-primary">Chào mừng bạn đến với FindJob</p>
      <p className="fotn-light text-gray-500 py-3">
        Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý
        tưởng
      </p>

      <form onSubmit={handleSubmit}>
        {/* form group - firstName */}
        <div className="form-group pb-3">
          <label htmlFor="" className="block pb-1">
            Họ và tên đệm
          </label>
          <div className="flex items-center border border-slate-300 rounded-lg p-2 ">
            <FontAwesomeIcon
              icon={faUser}
              className="text-primary text-xl pe-6"
            />
            <input
              type="text"
              name="firstName"
              placeholder="Nhập họ và tên đệm"
              required
              className="w-full outline-none"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* form group - lastName */}
        <div className="form-group pb-3">
          <label htmlFor="" className="block pb-1">
            Tên
          </label>
          <div className="flex items-center border border-slate-300 rounded-lg p-2 ">
            <FontAwesomeIcon
              icon={faUser}
              className="text-primary text-xl pe-6"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Nhập tên"
              required
              className="w-full outline-none"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* form group - phone */}
        <div className="form-group pb-3">
          <label htmlFor="" className="block pb-1">
            Số điện thoại
          </label>
          <div className="flex items-center border border-slate-300 rounded-lg p-2 ">
            <FontAwesomeIcon
              icon={faUser}
              className="text-primary text-xl pe-6"
            />
            <input
              type="number"
              name="phone"
              placeholder="Nhập số điện thoại"
              required
              className="w-full outline-none"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* form group - address */}
        <div className="form-group pb-3">
          <label htmlFor="" className="block pb-1">
            Địa chỉ
          </label>
          <div className="flex items-center border border-slate-300 rounded-lg p-2 ">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-primary text-xl pe-6"
            />
            <input
              type="text"
              name="adress"
              placeholder="Nhập địa chỉ"
              required
              className="w-full outline-none"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* form group - email */}
        <div className="form-group pb-3">
          <label htmlFor="" className="block pb-1">
            Email
          </label>
          <div className="flex items-center border border-slate-300 rounded-lg p-2 ">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-primary text-xl pe-6"
            />
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              required
              className="w-full outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* form group - password */}
        <div className="form-group pb-3">
          <label htmlFor="" className="block pb-1">
            Mật khẩu
          </label>
          <div className="flex items-center border border-slate-300 rounded-lg p-2 ">
            <FontAwesomeIcon
              icon={faLock}
              className="text-primary text-xl pe-6"
            />
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              required
              className="w-full outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* form group - confirm password */}
        <div className="form-group pb-3">
          <label htmlFor="" className="block pb-1">
            Xác nhận mật khẩu
          </label>
          <div className="flex items-center border border-slate-300 rounded-lg p-2 ">
            <FontAwesomeIcon
              icon={faLock}
              className="text-primary text-xl pe-6"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              required
              className="w-full outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Đồng ý chính sách bảo mật */}
        <div className="flex items-center">
          <input type="checkbox" style={{ height: "20px", width: "20px" }} />
          <label htmlFor="" className="ps-2">
            Tôi đã đọc và đồng ý với
            <Link to="/" className="text-primary">
              {" "}
              Điều khoản dịch vụ{" "}
            </Link>
            và
            <Link to="/" className="text-primary">
              {" "}
              Chính sách bảo mật{" "}
            </Link>
            của FindJob
          </label>
        </div>

        {/* Button Submit */}
        <div className="w-full rounded-lg bg-primary mt-3 py-3 hover:opacity-80">
          <button
            type="submit"
            className="btn btn-primary w-full text-white text-xl"
          >
            Đăng ký
          </button>
        </div>
      </form>

      {/* Phương thức khác */}
      <div className="">
        <p className="py-6 text-center text-slate-400">Hoặc đăng nhập bằng</p>
        <div className="flex justify-between items-center">
          <Link
            className="w-1/2 me-2 py-2 rounded-lg bg-primary text-lg text-white flex items-center justify-center hover:opacity-80"
            style={{ backgroundColor: "#e73b2f" }}
          >
            <FontAwesomeIcon
              icon={faGoogle}
              className="text-white text-lg pe-6"
            />
            Google
          </Link>
          <Link
            className="w-1/2 ms-2 py-2 rounded-lg bg-primary text-lg text-white flex items-center justify-center hover:opacity-80"
            style={{ backgroundColor: "#1877f2" }}
          >
            <FontAwesomeIcon
              icon={faSquareFacebook}
              className="text-white pe-6 text-2xl"
            />
            Facebook
          </Link>
        </div>

        {/* Đồng ý chính sách bảo mật mạng xã hội */}
        <div className="pt-4 flex items-center">
          <input type="checkbox" style={{ height: "20px", width: "20px" }} />
          <label htmlFor="" className="ps-2">
            Tôi đã đọc và đồng ý với
            <Link to="/" className="text-primary">
              {" "}
              Điều khoản dịch vụ{" "}
            </Link>
            và
            <Link to="/" className="text-primary">
              {" "}
              Chính sách bảo mật{" "}
            </Link>
            của FindJob
          </label>
        </div>
        {/* end: Đồng ý chính sách bảo mật mạng xã hội */}
      </div>

      {/* Đã có tài khoản */}
      <p className="pt-4 text-center">
        Bạn đã có tài khoản?{" "}
        <Link to="/login" className="text-primary">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
