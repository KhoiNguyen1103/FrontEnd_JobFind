import axiosClient from "./axiosClient";

const authApi = {
  login: (authRequest) => {
    const url = "/auth/login";
    return axiosClient.post(url, authRequest);
  },

  register: (registrationRequest) => {
    const url = "/auth/register";
    return axiosClient.post(url, registrationRequest);
  },

  verifyOtp: (verifyOtpRequest) => {
    const url = "/auth/verify-otp";
    return axiosClient.post(url, verifyOtpRequest);
  },

  resendOtp: (email) => {
    const url = "/auth/resend-otp";
    return axiosClient.post(url, { email });
  },
};

export default authApi;
