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
  isAuthenticated: async function () {
    let token = localStorage.getItem("token");

    if (!token) {
      try {
        const response = await this.refreshToken();
        token = response;
      } catch (error) {
        return false;
      }
    }

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      try {
        const response = await this.refreshToken();
        token = response;
      } catch (error) {
        return false;
      }
    }

    return true;
  },
  getAuthToken: function () {
    return localStorage.getItem("token");
  },
  refreshToken: async function () {
    const response = await api.post("/api/refreshToken");
    const { token } = response.token;
    localStorage.setItem("token", token);
    return token;
  },
};

export { authService };
