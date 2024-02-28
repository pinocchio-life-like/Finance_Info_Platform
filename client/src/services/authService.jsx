//dummy implementation for JWT authentication and Work on after backend is ready
import { jwtDecode } from "jwt-decode";

const dummyToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const dummyRefreshToken = "dummy-refresh-token";

const authService = {
  login: async function (username, password) {
    localStorage.setItem("token", dummyToken);
    localStorage.setItem("refreshToken", dummyRefreshToken);
    return { data: { token: dummyToken, refreshToken: dummyRefreshToken } };
  },
  logout: function () {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
  isAuthenticated: function () {
    const token = localStorage.getItem("token");
    if (!token) return false;

    if (token === dummyToken) return true;

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  },
  getAuthToken: function () {
    return localStorage.getItem("token");
  },
  refreshToken: async function () {
    localStorage.setItem("token", dummyToken);
    return dummyToken;
  },
};

export { authService };

// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const authService = {
//   login: async function (username, password) {
//     try {
//       const response = await axios.post("/api/auth/login", {
//         username,
//         password,
//       });
//       const { token, refreshToken } = response.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("refreshToken", refreshToken);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },
//   logout: function () {
//     localStorage.removeItem("token");
//     localStorage.removeItem("refreshToken");
//   },
//   isAuthenticated: function () {
//     const token = localStorage.getItem("token");
//     if (!token) return false;

//     const decoded = jwtDecode(token);
//     const currentTime = Date.now() / 1000;
//     return decoded.exp > currentTime;
//   },
//   getAuthToken: function () {
//     return localStorage.getItem("token");
//   },
//   refreshToken: async function () {
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (!refreshToken) throw new Error("No refresh token found");

//     try {
//       const response = await axios.post("/api/auth/refresh", { refreshToken });
//       const { token } = response.data;
//       localStorage.setItem("token", token);
//       return token;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// export { authService };
