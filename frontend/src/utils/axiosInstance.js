import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://preppilot-ai.onrender.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized access - redirecting to login");
        window.location.href = "/";
      } else if (error.response.status === 500) {
        console.error("Internal server error - please try again later");
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timed out - please try again later");
      } else {
        console.error("An error occurred:", error.response.data);
      }
    } else {
      console.error("Network error or no response from server:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
