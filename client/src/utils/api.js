import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      return api.post("/api/refreshToken").then((response) => {
        const newToken = response.data.token;
        api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return api(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);

export default api;
