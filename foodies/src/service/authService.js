import api from "../api/axiosConfig";

const API_URL = "http://localhost:8080/api";

export const registerUser = async (data) => {
  return await api.post("/register", {
    ...data,
    email: data.email?.trim().toLowerCase(),
  });
};

export const login = async (data) => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  const normalizedData = {
    ...data,
    email: data.email?.trim().toLowerCase(),
  };
  const response = await api.post("/login", normalizedData);
  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userEmail", response.data.email || normalizedData.email);
  }
  return response;
};
