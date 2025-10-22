import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authApi from "../../api/authApi";
import industryApi from "../../api/industryApi";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
      toast.error("Đăng ký thất bại. Vui lòng thử lại!", { autoClose: 3000 });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
      <div>
        <img src={logo} alt="Logo" className="w-44 mx-auto object-contain" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Đăng ký nhà tuyển dụng
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-sm">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChangeFormData}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Số điện thoại <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChangeFormData}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Mật khẩu <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChangeFormData}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Tên công ty <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChangeFormData}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Ngành nghề <span className="text-red-600">*</span>
            </label>
            <select
              name="industry"
              value={selectedIndustries?.industryId || ""}
              onChange={handleIndustryChange}
              required
              className="input"
            >
              <option value="">Chọn ngành nghề *</option>
              {businessFields.map((field) => (
                <option key={field.industryId} value={field.industryId}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Logo công ty <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              name="logoPath"
              accept="image/*"
              onChange={handleFileChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Website công ty
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChangeFormData}
              className="input"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium text-sm">
            Mô tả công ty
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChangeFormData}
            className="input"
          />
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p>
            Đã có tài khoản?{" "}
            <Link
              to="/recruiter/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700"
          >
            Đăng ký
          </button>
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
}
export default RecruiterRegister;