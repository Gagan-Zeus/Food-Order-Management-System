import api from "../api/axiosConfig";

export const registerAdmin = async (data) => {
  try {
    // Use relative path since baseURL is in api
    const response = await api.post("/admin/auth/register", data);
    return response;
  } catch (error) {
    console.error("Error registering admin:", error);
    throw error;
  }
};

export const adminLogin = async (data) => {
  try {
    const response = await api.post("/admin/auth/login", data);
    const token = response.data?.token;

    if (!token || typeof token !== "string") {
      throw new Error("Admin login response did not include a token");
    }

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminUserEmail");
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminEmail", response.data.email || data.email);

    return response;
  } catch (error) {
    console.error("Error logging in admin:", error);
    throw error;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("adminUserEmail");

  window.location.href = "/admin/login";
};
