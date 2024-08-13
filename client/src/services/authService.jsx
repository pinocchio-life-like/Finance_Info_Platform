import { jwtDecode } from "jwt-decode";
import api from "../utils/api";
const authService = {
  login: async function (data) {
    const response = await api.post("/api/login", {
      data: data,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response;
  },
  logout: async function () {
    try {
      sessionStorage.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("persist:root");

      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
        }
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      await api.post("/api/logout");
    }
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
    const token = localStorage.getItem("token");
    // Only attempt to refresh the token if one exists
    if (token) {
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
    } else {
      // If there's no token, throw an error or handle this case as needed
      throw new Error("No token available to refresh");
    }
  },
};

export { authService };
