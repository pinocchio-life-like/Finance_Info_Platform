import { jwtDecode } from "jwt-decode";
import api from "../utils/api";
const authService = {
  login: async function (data) {
    const response = await api.post("/api/login", {
      data,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response;
  },
  logout: function () {
    api.post("/api/logout");
    localStorage.removeItem("token");
  },
  isAuthenticated: function () {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return false;
    }

    return true;
  },
  getAuthToken: function () {
    return localStorage.getItem("token");
  },
  refreshToken: async function () {
    try {
      const response = await api.post("/api/refreshToken");
      const { token } = response.data;
      localStorage.setItem("token", token);
      return token;
    } catch (error) {
      // If the refresh token is expired or undefined, log the user out
      if (error.response && error.response.status === 401) {
        this.logout();
      }
      throw error;
    }
  },
};

export { authService };
