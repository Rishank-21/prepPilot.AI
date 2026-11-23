import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL ||
    (import.meta.env.DEV ? "" : "https://preppilot-ai.onrender.com"),
  timeout: 40000,
  headers: { Accept: "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(undefined, (error) => {
  const isAuthForm = ["/api/auth/login", "/api/auth/register"].includes(error.config?.url);
  if (error.response?.status === 401 && !isAuthForm && error.config?.headers?.Authorization) {
    localStorage.removeItem("token");
    window.location.assign("/login");
  }
  return Promise.reject(error);
});

export default axiosInstance;
