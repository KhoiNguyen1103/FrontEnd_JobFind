import { useState } from "react";

// import data
import citys from "../../data/citys";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const businessFields = [
  {
    id: 1,
    name: "Dịch vụ lưu trú, nhà hàng, khách sạn và du lịch",
  },
  {
    id: 2,
    name: "Hoạt động kế toán và kiểm toán",
  },
  {
    id: 3,
    name: "Nông nghiệp, lâm nghiệp và nuôi trồng thủy sản",
  },
  {
    id: 4,
    name: "Dịch vụ thú y",
  },
  {
    id: 5,
    name: "Kiến trúc và thiết kế nội thất",
  },
  {
    id: 6,
    name: "Nghệ thuật, giải trí và truyền thông",
  },
  {
    id: 7,
    name: "Hoạt động sản xuất và ứng dụng công nghệ tự động hóa",
  },
  {
    id: 8,
    name: "Sản xuất, phân phối và dịch vụ liên quan đến ô tô",
  },
  {
    id: 9,
    name: "Hoạt động ngân hàng",
  },
];

const formFields = [
  {
    label: "Họ và tên",
    name: "name",
    type: "text",
    placeholder: "Nhập tên",
    required: true,
    errorMsg: "Vui lòng nhập họ và tên!",
  },
  {
    label: "Số điện thoại",
    name: "phone",
    type: "number",
    placeholder: "Nhập số điện thoại",
    required: true,
    errorMsg: "Vui lòng nhập số điện thoại!",
  },
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
  {
    label: "Tên công ty",
    name: "companyName",
    type: "text",
    placeholder: "Nhập tên công ty",
    required: true,
    errorMsg: "Vui lòng nhập tên công ty!",
  },
  {
    label: "Địa điểm",
    name: "location",
    type: "select",
    options: citys, // array từ file citys
    required: true,
    errorMsg: "Vui lòng chọn địa điểm!",
  },
  {
    label: "Lĩnh vực hoạt động",
    name: "businessFields",
    type: "select",
    options: businessFields, // array lĩnh vực
    required: true,
    errorMsg: "Vui lòng chọn lĩnh vực hoạt động!",
  },
];

const RecruiterRegister = () => {
  const [formData, setFormData] = useState({
    name: "Nguyễn Minh Nhật",
    phone: "0123456789",
    email: "abc@gmail.com",
    password: "123456789",
    companyName: "Công ty ABC",
    location: "Hồ Chí Minh",
    businessFields: "Hoạt động ngân hàng",
  });

  // Xử lý khi thay đổi input
  const handleChangeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // in console log để kiểm tra dữ liệu
    console.log(formData);

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
    <div className="re-login flex justify-between bg-slate-100 items-stretch h-fit">
      {/* ========== Thẻ div chứa form thông tin ============== */}
      <div className="w-full p-4" style={{ maxWidth: "60%" }}>
        {/* form thông tin */}
        <form
          onSubmit={handleSubmit}
          action=""
          className="mx-auto bg-white p-8 rounded-md w-fit"
        >
          {/* ========== Thông tin tài khoản ============== */}
          <p className="text-xl font-semibold pb-4">Thông tin tài khoản</p>

          {formFields.map((field) => (
            <div className="form-group mb-3" key={field.name}>
              <label htmlFor={field.name} className="font-semibold pb-2">
                {field.label}{" "}
                {field.required && <span className="text-red-600">*</span>}
              </label>

              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChangeFormData}
                  className="form-control w-full p-2 border border-gray-300 rounded-md outline-none"
                  required={field.required}
                  onInvalid={(e) =>
                    e.target.setCustomValidity(field.errorMsg || "")
                  }
                  onInput={(e) => e.target.setCustomValidity("")}
                >
                  <option value="">Chọn {field.label.toLowerCase()}</option>
                  {field.options.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              ) : (
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
              )}
            </div>
          ))}

          {/* =========== button submit form ============ */}
          <div className="flex justify-between mt-4 items-center pt-4">
            <p className="text-slate-700">
              Bạn đã có tài khoản ?{" "}
              <Link
                to={"/recruiter/login"}
                className="text-blue-600 hover:underline font-semibold"
              >
                Đăng nhập
              </Link>
            </p>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-green-600 text-white font-semibold"
            >
              Hoàn thành đăng ký
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

export default RecruiterRegister;
