import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import authApi from "./../../api/authApi";

const formFields = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "abc@gmail.com",
    required: true,
    errorMsg: "Vui lòng nhập email!",
  },
  {
    label: "Mật khẩu",
    name: "password",
    type: "password",
    placeholder: "12345#21@",
    required: true,
    errorMsg: "Vui lòng nhập mật khẩu!",
  },
];

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null); 

  const handleChangeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authApi.login(formData);
      const user = response;
      dispatch(login({ user }));
      navigate("/recruiter/home");
    } catch (err) {
      setError(
        "Vui lòng kiểm tra lại email hoặc mật khẩu."
      );
    }
  };

  return (
    <div className="re-login flex justify-between bg-slate-100 items-stretch h-screen">
      <div className="w-full p-4 flex items-center" style={{ maxWidth: "60%" }}>
        <form
          onSubmit={handleSubmit}
          className="mx-auto bg-white p-8 rounded-md w-1/2"
        >
          <p className="text-xl font-semibold pb-4">Thông tin tài khoản</p>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          {formFields.map((field) => (
            <div className="form-group mb-3" key={field.name}>
              <label htmlFor={field.name} className="font-semibold pb-2">
                {field.label}{" "}
                {field.required && <span className="text-red-600">*</span>}
              </label>

              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                className="form-control w-full p-2 border border-gray-300 rounded-md outline-none"
                placeholder={field.placeholder}
                onChange={handleChangeFormData}
                required={field.required}
                onInvalid={(e) =>
                  e.target.setCustomValidity(field.errorMsg || "")
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
          ))}

          <div className="flex justify-between mt-4 items-center pt-4">
            <p className="text-slate-700">
              Bạn chưa có tài khoản ?{" "}
              <Link
                to={"/recruiter/register"}
                className="text-blue-600 hover:underline font-semibold"
              >
                Đăng ký
              </Link>
            </p>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-green-600 text-white font-semibold"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 bg-login-register">
        <img
          src="/logo_no_bg.png"
          alt="Logo"
          className="w-full h-80 object-fit"
        />

        <div className="flex items-center h-1/2">
          <Link
            to={"/home"}
            className="flex justify-center items-center py-4 w-3/5 mx-auto bg-white rounded-md cursor-pointer hover:bg-black hover:text-white transition-all duration-200"
          >
            <input
              type="button"
              value={"Tới trang tìm việc"}
              className="font-semibold text-xl cursor-pointer"
            />
            <FontAwesomeIcon icon={faArrowRight} className="ps-4 text-xl" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecruiterLogin;