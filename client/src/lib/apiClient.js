import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    
    return Promise.reject(err.response?.data || { message: "Something went wrong" });
  }
);

export default apiClient;
