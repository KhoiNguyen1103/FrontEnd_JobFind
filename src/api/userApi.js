import axiosClient from './axiosClient';

const userApi = {
  updateProfile: (formData) => {
    const url = '/user/update-profile';
    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  changePassword: (data) => {
    const url = '/user/change-password';
    return axiosClient.post(url, data); 
  },
};

export default userApi;
