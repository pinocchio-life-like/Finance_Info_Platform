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
    if (!token) return false;

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
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
