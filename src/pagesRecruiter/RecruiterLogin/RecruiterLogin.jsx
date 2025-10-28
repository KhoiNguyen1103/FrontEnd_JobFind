import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import authApi from "./../../api/authApi";
import logo from "../../assets/logo.png";

const formFields = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "company@gmail.com",
    required: true,
    errorMsg: "Vui lòng nhập email!",
  },
  {
    label: "Mật khẩu",
    name: "password",
    type: "password",
    placeholder: "••••••••",
    required: true,
    errorMsg: "Vui lòng nhập mật khẩu!",
  },
];

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "hr@fptsoftware.com",
    password: "Test#123",
  });
  const [error, setError] = useState(null);

  const handleChangeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.login(formData);
      console.log("response", response);
      const user = response;
      dispatch(login(user));
      navigate("/recruiter/home");
    } catch (err) {
      console.log(err);
      setError("Vui lòng kiểm tra lại email hoặc mật khẩu.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
      <div>
        <img src={logo} alt="Logo" className="w-44 mx-auto object-contain" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Đăng nhập Nhà tuyển dụng
        </h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {formFields.map((field) => (
          <div className="mb-4" key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-semibold mb-1 text-gray-700"
            >
              {field.label}{" "}
              {field.required && <span className="text-red-600">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              placeholder={field.placeholder}
              onChange={handleChangeFormData}
              required={field.required}
              onInvalid={(e) =>
                e.target.setCustomValidity(field.errorMsg || "")
              }
              onInput={(e) => e.target.setCustomValidity("")}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
        >
          Đăng nhập
        </button>

        <div className="text-sm text-center mt-4 text-gray-600">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/recruiter/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Đăng ký
          </Link>
        </div>

        <div className="flex justify-center mt-6">
          <Link
            to="/home"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition"
          >
            Tới trang tìm việc
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RecruiterLogin;
