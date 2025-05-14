import axios from "axios";
import { BASE_URL } from "./apiPaths";
import toast from "react-hot-toast";
//import axiosRetry from "axios-retry"; 

console.log("🚀 Axios baseURL:", BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

 //Optional: Retry failed requests (e.g., due to network errors or timeouts)
 //axiosRetry(axiosInstance, {
  // retries: 2,
  // retryDelay: (retryCount) => retryCount * 1000,
  // retryCondition: (error) =>
 //   axiosRetry.isNetworkError(error) || error.code === "ECONNABORTED",
// });

// Helper: Safely check if JWT token is expired
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now(); // expiration in milliseconds
  } catch (err) {
    console.warn("⚠️ Invalid token format or decoding error:", err);
    return true;
  }
};

// Request Interceptor — Attach Authorization header if token is valid
axiosInstance.interceptors.request.use(
  (config) => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      localStorage.removeItem("user");
    }

    const accessToken = user?.token;
    if (accessToken && !isTokenExpired(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — Handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, code } = error;

    if (response) {
      const status = response.status;
      const message = response.data?.message || error.message;

      if (status === 401) {
        localStorage.removeItem("user");
        toast.error("Session expired. Please log in again.");

        const currentPath = window.location.pathname;
        if (!/\/login/.test(currentPath)) {
          window.location.href = "/login";
        }
      } else if (status === 500) {
        console.error("🔥 Server Error:", message);
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message);
      }
    } else if (code === "ECONNABORTED") {
      toast.error("⏱️ Request timeout. Please try again.");
    } else {
      console.error("❌ Unknown Axios error", error);
      toast.error("Something went wrong. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
