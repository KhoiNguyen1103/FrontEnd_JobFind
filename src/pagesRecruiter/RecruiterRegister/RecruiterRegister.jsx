import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import authApi from "./../../api/authApi";
import industryApi from "./../../api/industryApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    label: "Số điện thoại",
    name: "phone",
    type: "number",
    placeholder: "Nhập số điện thoại",
    required: true,
    errorMsg: "Vui lòng nhập số điện thoại!",
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
    label: "Ngành nghề hoạt động",
    name: "industry",
    type: "select",
    options: [],
    required: true,
    errorMsg: "Vui lòng chọn ngành nghề hoạt động!",
  },
  {
    label: "Logo công ty (URL)",
    name: "logoPath",
    type: "file",
    placeholder: "Nhập đường dẫn logo",
    required: true,
    errorMsg: "Vui lòng nhập đường dẫn logo nếu có!",
  },
  {
    label: "Website công ty",
    name: "website",
    type: "text",
    placeholder: "Nhập website công ty",
    required: false,
    errorMsg: "Vui lòng nhập website công ty nếu có!",
  },
  {
    label: "Mô tả công ty",
    name: "description",
    type: "textarea",
    placeholder: "Nhập mô tả công ty",
    required: false,
    errorMsg: "Vui lòng nhập mô tả công ty!",
  },
];

const RecruiterRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    companyName: "",
    industry: "",
    logoPath: "",
    website: "",
    description: "",
  });

  const [businessFields, setBusinessFields] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await industryApi.getAll();
        const industries = response;
        setBusinessFields(industries);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ngành nghề", error);
      }
    };

    fetchIndustries();
  }, []);

  const handleChangeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logoPath: e.target.files[0] });
  };

  const handleIndustryChange = (e) => {
    const selectedId = e.target.value;

    const selectedIndustry = businessFields.find(
      (option) => option.industryId.toString() === selectedId.toString()
    );

    if (selectedIndustry) {
      console.log("Selected Industry:", selectedIndustry);
      setSelectedIndustries({
        industryId: selectedIndustry.industryId,
        name: selectedIndustry.name,
      });
    } else {
      setSelectedIndustries(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("password", formData.password);
    form.append("companyName", formData.companyName);
    form.append("website", formData.website);
    form.append("industryIds", selectedIndustries.industryId);
    form.append("description", formData.description);
    form.append("role", "COMPANY");

    if (formData.logoPath) {
      form.append("logoPath", formData.logoPath);
    }

    try {
      const response = await authApi.register(form);
      console.log("Đăng ký thành công:", response);

      toast.success("Đăng ký thành công!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/recruiter/home");
      }, 3000);
    } catch (error) {
      console.error("Đăng ký thất bại:", error);

      toast.error("Đăng ký thất bại. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="re-login flex justify-between bg-slate-100 items-stretch h-fit">
      {/* ========== Thẻ div chứa form thông tin ============== */}
      <div className="w-full p-4" style={{ maxWidth: "60%" }}>
        {/* form thông tin */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto bg-white p-8 rounded-md w-fit"
        >
          {/* ========== Thông tin tài khoản ============== */}
          <p className="text-xl font-semibold pb-4">Thông tin tài khoản</p>
          {formFields
            .filter((f) => f.name === "email")
            .map((field) => (
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

          <div className="flex gap-4">
            {formFields
              .filter((f) => f.name === "phone" || f.name === "password")
              .map((field) => (
                <div className="form-group mb-3 w-1/2" key={field.name}>
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
          </div>
          {formFields
            .filter(
              (f) =>
                !["phone", "password", "email", "logoPath"].includes(f.name)
            )
            .map((field) => (
              <div className="form-group mb-3" key={field.name}>
                <label htmlFor={field.name} className="font-semibold pb-2">
                  {field.label}{" "}
                  {field.required && <span className="text-red-600">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="form-control w-full p-2 border border-gray-300 rounded-md outline-none"
                    value={formData[field.name]}
                    onChange={handleChangeFormData}
                  />
                ) : field.type === "select" ? (
                  <select
                    name="industry"
                    value={
                      selectedIndustries ? selectedIndustries.industryId : ""
                    }
                    onChange={handleIndustryChange}
                    className="form-control w-full p-2 border border-gray-300 rounded-md outline-none"
                  >
                    <option value="">Chọn ngành nghề</option>
                    {businessFields.map((option) => (
                      <option key={option.industryId} value={option.industryId}>
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

                {field.name === "companyName" && (
                  <div className="form-group mt-3">
                    <label htmlFor="logoPath" className="font-semibold pb-2">
                      Logo công ty <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="file"
                      name="logoPath"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control w-full p-2 border border-gray-300 rounded-md outline-none"
                      required
                    />
                  </div>
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
        <ToastContainer />
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
