import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const isAuthRequest =
      config.url?.includes("/login") || config.url?.includes("/register");
    const token = localStorage.getItem("adminToken");

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest =
      error.config?.url?.includes("/login") ||
      error.config?.url?.includes("/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminUserEmail");

      if (window.location.pathname !== "/admin/login") {
        window.location.replace("/admin/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
