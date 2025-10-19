import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";

import { useState } from "react";
import { login } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

// ảnh logo test đăng nhập
import vina68 from "../../assets/images/image_products/vina68.webp";

// api services
import loginService from "../../services/loginService";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Theo dõi trạng thái form
  const [formData, setFormData] = useState({
    email: "nhat@gmail.com",
    password: "StrongPass@123",
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

    const { email, password } = formData;

    try {
      const result = await loginService({ email, password });

      const payload = {
        ...result,
        avatar: vina68, // Tạo avatar theo username
      };
      dispatch(login({ user: payload })); // Lưu thông tin người dùng vào Redux store
      console.log("Kết quả đăng nhập:", payload);

      // Lưu token hoặc user info nếu có
      // localStorage.setItem("tokenUser", result.token);

      // Redirect sang trang chính hoặc dashboard
      navigate("/home");
    } catch (error) {
      console.error(error.message || "Đăng nhập thất bại");
    }

    // Fake user data
    // const fakeUser = {
    //   id: 1,
    //   role: 2,
    //   email: formData.email,
    //   username: "Nguyen Van A",
    //   avatar: vina68, // Tạo avatar theo username
    // };

    // dispatch(login({ user: fakeUser }));
    // navigate("/");
  };

  return (
    <div className="mx-auto pt-6">
      <p className="text-2xl text-primary">Chào mừng bạn đã quay trở lại</p>
      <p className="fotn-light text-gray-500 py-3">
        Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý
        tưởng
      </p>

      <form action="">
        {/* form group */}
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
        </div>
        {/* form group */}
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
        {/* Quên mật khẩu */}
        <Link to="/" className="text-primary text-right">
          Quên mật khẩu
        </Link>
        {/* Button Submit */}
        <div
          className="w-full rounded-lg bg-primary mt-3 py-3 hover:opacity-80 cursor-pointer"
          onClick={handleSubmit}
        >
          <button
            type="submit"
            className="btn btn-primary w-full text-white text-xl block text-center"
          >
            Đăng nhập
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
        Bạn chưa có tài khoản?{" "}
        <Link to="/signup" className="text-primary">
          Đăng ký
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
