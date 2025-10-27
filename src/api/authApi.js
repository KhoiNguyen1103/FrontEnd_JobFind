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
};

export default authApi;
