import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import { Alert } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
    baseURL: `${API_URL}`, 
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: (params) => new URLSearchParams(params).toString(),
});

axiosClient.interceptors.request.use(async (config) => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error getting token:', error);
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');

            const navigate = useNavigate();  
            Alert.alert(
                "Session Expired",
                "Your session has expired. Please log in again.",
                [
                    { 
                        text: "OK", 
                        onPress: () => {
                            navigate('/recruiter/login');  
                        }
                    }
                ]
            );
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
