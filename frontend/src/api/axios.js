import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const instance = axios.create({
  baseURL: getBaseURL(),
});

// Add a request interceptor to include the auth token in all requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
