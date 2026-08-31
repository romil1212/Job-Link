import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper to get token under any standard storage key
const getStoredToken = () => {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    null
  );
};

// Request Interceptor: Attach Access Token
API.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle Token Refresh & Queuing
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip refresh attempt for auth endpoints to prevent loops
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/verify-email") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.get(`${BASE_URL}/auth/refresh-token`, {
          withCredentials: true,
        });

        const newToken = data.accessToken || data.token;
        if (!newToken) {
          throw new Error("No token returned from refresh endpoint");
        }

        // Save token to all common storage keys
        localStorage.setItem("accessToken", newToken);
        localStorage.setItem("token", newToken);

        API.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return API(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Avoid infinite reload redirect if already on login/register pages
        const publicPaths = ["/login", "/register", "/verify-email", "/forgot-password"];
        const isPublicPath = publicPaths.some((path) =>
          window.location.pathname.startsWith(path)
        );

        if (!isPublicPath) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;