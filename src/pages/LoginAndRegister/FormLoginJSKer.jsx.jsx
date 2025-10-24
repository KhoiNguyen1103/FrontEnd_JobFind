import { useState } from "react";
import PropTypes from "prop-types";
import authApi from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const App = ({ setIsLogin }) => {
  const navigate = useNavigate();

  // State to manage form data and error messages
  const [formData, setFormData] = useState({
    email: "nhat@gmail.com",
    password: "StrongPass@123",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change and clear error messages
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form inputs
  // Check if the form is valid before submitting
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  // Handle form submission and show a success message
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        console.log("Login with data: ", formData);
        const authRespone = await authApi.login(formData);
        console.log("Login response: ", authRespone);
        toast.success("Login successful!", { autoClose: 1000 });

        localStorage.setItem("token", authRespone.token);
        localStorage.setItem("user", JSON.stringify(authRespone));
        navigate("/");
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  return (
    <div className="w-1/2 bg-white p-12 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl rotate-12 flex items-center justify-center transform transition-transform hover:rotate-0 duration-300">
              <i className="fas fa-briefcase text-white text-2xl -rotate-12 transform transition-transform hover:rotate-0 duration-300"></i>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500">Sign in to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                id="loginEmail"
                name="loginEmail"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 pr-3 py-3 w-full border ${
                  errors.loginEmail ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="john.doe@example.com"
              />
            </div>
            {errors.loginEmail && (
              <p className="mt-1 text-sm text-red-500">{errors.loginEmail}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="loginPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="loginPassword"
                name="loginPassword"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-3 py-3 w-full border ${
                  errors.loginPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="••••••••"
              />
            </div>
            {errors.loginPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.loginPassword}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="!rounded-button whitespace-nowrap w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                Processing...
              </>
            ) : (
              "Sign In"
            )}
          </button>
          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Do not have an account?
              <span
                onClick={() => setIsLogin(false)}
                className="ml-1 text-blue-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
App.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};

export default App;
