import { useState, useEffect } from "react";

import authApi from "./../../api/authApi";
import industryApi from "./../../api/industryApi";
import { useNavigate } from "react-router-dom";
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
        setBusinessFields(response);
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
    const selected = businessFields.find(
      (option) => option.industryId.toString() === selectedId
    );
    setSelectedIndustries(selected || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("password", formData.password);
    form.append("companyName", formData.companyName);
    form.append("website", formData.website);
    form.append("industryIds", selectedIndustries?.industryId || "");
    form.append("description", formData.description);
    form.append("role", "COMPANY");

    if (formData.logoPath) {
      form.append("logoPath", formData.logoPath);
    }

    try {
      await authApi.register(form);
      toast.success("Đăng ký thành công!", { autoClose: 3000 });
      setTimeout(() => navigate("/recruiter/home"), 3000);
    } catch (error) {
      console.log("Lỗi đăng ký:", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại!", { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ========== Thẻ div chứa form thông tin ============== */}
      <div className="w-1/2 bg-white p-12 overflow-y-auto">
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
          <button
            type="submit"
            className="!rounded-button whitespace-nowrap w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
          >
            Hoàn thành đăng ký
          </button>
          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Bạn đã có tài khoản?
              <span className="ml-1 text-blue-500 hover:text-blue-600 font-medium transition-colors cursor-pointer">
                Đăng nhập
              </span>
            </p>
          </div>
        </form>
        <ToastContainer />
        {/* end: form thông tin */}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Đăng ký nhà tuyển dụng
        </h2>

        {/* =================== div chứa background ============= */}
        <div className="w-1/2 relative">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/visual_company_register.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px]"></div>
          </div>
          {/* Overlay Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Start Hiring Today!</h2>
            <p className="text-lg mb-8 max-w-md">
              Join thousands of companies who trust us to help them find the
              perfect candidates for their teams.
            </p>
            <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">1M+</div>
                <div className="text-sm">Active Job Seekers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">48h</div>
                <div className="text-sm">Average Hiring Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">92%</div>
                <div className="text-sm">Employer Satisfaction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm">Dedicated Support</div>
              </div>
            </div>
          </div>
          {/* Button go to home */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center w-1/2">
            <a
              href="/"
              className="block bg-white text-blue-600 font-semibold px-5 py-3 rounded-full shadow-md hover:bg-blue-100 transition-all duration-200 text-center"
            >
              Go to Home
            </a>
          </div>
        </div>
        <ToastContainer />
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
export default RecruiterRegister;
