import axios from "axios";
import { BASE_URL } from "./apiPaths";

console.log("BASE_URL from env:", BASE_URL); // Debug: Check if BASE_URL is loaded

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
    console.log("Full Request URL:", `${BASE_URL}${config.url}`); // Show full URL
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
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized, redirect to login or show a message
        console.error("Unauthorized access - redirecting to login");
        window.location.href = "/"; // Redirect to login page
        // Optionally, you can redirect to login page here
      } else if (error.response.status === 500) {
        // Internal server error, show a message
        console.error("Internal server error - please try again later");
      } else if (error.code === "ECONNABORTED") {
        // Request timed out
        console.error("Request timed out - please try again later");
      } else {
        // Other errors
        console.error("An error occurred:", error.response.data);
      }
    } else {
      // Network or other errors
      console.error("Network error or no response from server:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
