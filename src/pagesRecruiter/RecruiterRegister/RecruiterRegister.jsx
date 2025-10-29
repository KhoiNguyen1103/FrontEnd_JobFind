import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

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

  useEffect(() => {
    let timer;
    if (showOtpModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, countdown]);

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
    setLoading(true);
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
      toast.success("Vui lòng kiểm tra email để nhận OTP", { autoClose: 3000 });
      setShowOtpModal(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!",
        { autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Vui lòng nhập OTP 6 chữ số!", { autoClose: 3000 });
      return;
    }

    setIsVerifying(true);
    try {
      await authApi.verifyOtp({ email: formData.email, otp });
      toast.success("Xác minh OTP thành công", { autoClose: 1500 });
      setShowOtpModal(false);
      toast.success("Đăng ký thành công", { autoClose: 1500 });
      setTimeout(() => {
        setShowOtpModal(false);
        navigate("/recruiter/login");
      }, 3000);
    } catch (error) {
      toast.error("OTP không đúng, vui lòng kiểm tra lại hộp thư", {
        autoClose: 2000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendDisabled(true);
    setCountdown(60);

    try {
      await authApi.resendOtp(formData.email);
      toast.success("OTP mới đã được gửi!", { autoClose: 3000 });
    } catch (error) {
      toast.error("Gửi lại OTP thất bại. Vui lòng thử lại!", {
        autoClose: 2000,
      });
      setIsResendDisabled(false);
      setCountdown(0);
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
            className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:opacity-80"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </div>
        <div className="flex justify-center mt-6">
          <Link
            to="/home"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition"
          >
            Xem thị tường công việc
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </form>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Xác minh OTP</h3>
            <p className="mb-4">
              Vui lòng nhập mã OTP được gửi đến email {formData.email}
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập OTP (6 chữ số)"
              maxLength={6}
              className="input mb-4"
            />
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                className={`text-blue-600 font-medium ${
                  isResendDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:underline"
                }`}
              >
                Gửi lại OTP {isResendDisabled && `(${countdown}s)`}
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className={`bg-primary text-white px-4 py-2 rounded-md font-semibold ${
                  isVerifying
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-80"
                }`}
              >
                {isVerifying ? "Đang xác minh..." : "Xác minh"}
              </button>
            </div>
            <button
              onClick={() => setShowOtpModal(false)}
              className="text-gray-600 hover:underline"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

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
