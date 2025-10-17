import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// import data
import { Link, useNavigate } from "react-router-dom";

// redux
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";

const formFields = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Nhập email",
    required: true,
    errorMsg: "Vui lòng nhập email!",
  },
  {
    label: "Mật khẩu",
    name: "password",
    type: "password",
    placeholder: "Nhập mật khẩu",
    required: true,
    errorMsg: "Vui lòng nhập mật khẩu!",
  },
];

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "abc@gmail.com",
    password: "123456789",
  });

  // Xử lý khi thay đổi input
  const handleChangeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // in console log để kiểm tra dữ liệu
    // console.log(formData);

    // Điều hướng tới trang chủ
    const fakeUser = {
      id: 1,
      role: 1,
      email: formData.email,
      username: "Tui là Nhà tuyển dụng",
      avatar:
        "https://res.cloudinary.com/dz1nfbpra/image/upload/v1742040186/Screenshot_2025-02-26_182955_dvxonq.png",
    };
    dispatch(login({ user: fakeUser }));
    navigate("/recruiter/home");

    // --- Khi có BE sau này chỉ cần gọi API ở đây ---
    // fetch("/api/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // })
    // .then(res => res.json())
    // .then(data => console.log(data))
    // .catch(err => console.error(err));
  };

  return (
    <div className="re-login flex justify-between bg-slate-100 items-stretch h-screen">
      {/* ========== Thẻ div chứa form thông tin ============== */}
      <div className="w-full p-4 flex items-center" style={{ maxWidth: "60%" }}>
        {/* form thông tin */}
        <form
          onSubmit={handleSubmit}
          action=""
          className="mx-auto bg-white p-8 rounded-md w-1/2"
        >
          {/* ========== Thông tin tài khoản ============== */}
          <p className="text-xl font-semibold pb-4">Thông tin tài khoản</p>

          {formFields.map((field) => (
            <div className="form-group mb-3" key={field.name}>
              <label htmlFor={field.name} className="font-semibold pb-2">
                {field.label}{" "}
                {field.required && <span className="text-red-600">*</span>}
              </label>

              {
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
              }
            </div>
          ))}

          {/* =========== button submit form ============ */}
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
          {/* =========== end: button submit form ============ */}
        </form>
        {/* end: form thông tin */}
      </div>
      {/* ========== End: Thẻ div chứa form thông tin ============== */}

      {/* =================== div chứa background ============= */}
      <div className="flex-1 bg-login-register">
        <img
          src="/logo_no_bg.png"
          alt="Logo"
          className="w-full h-80 object-fit"
        />

        {/* button tới trang làm việc */}
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
        {/* end: button tới trang tìm việc */}
      </div>
      {/* =================== end: div chứa background ============= */}
    </div>
  );
};

export default RecruiterLogin;
