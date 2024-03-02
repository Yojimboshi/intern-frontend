// configs/axiosConfig.ts
import axios from 'axios';
import authConfig from 'src/configs/auth';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  config => {
    // Retrieve the token using the key from your authConfig
    const token = localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    console.log(`Request sent to ${config.url}`);

    return config;
  },
  error => {
    console.error(`Request error: ${error.message}`);

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    // Simple log to indicate a successful response was received
    console.log(`Response received from ${response.config.url} with status code ${response.status}`);

    return response;
  },
  error => {
    // Simple log for response error
    console.error(`Response error from ${error.response?.config.url}: ${error.message}`);

    return Promise.reject(error);
  }
);

export default axiosInstance;
