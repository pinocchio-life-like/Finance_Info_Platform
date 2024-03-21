import axios from "axios";

const api = axios.create({
  baseURL: "https://wihinfo.onrender.com",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/refreshToken"
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/api/refreshToken");
        const { token } = response.data;
        api.defaults.headers.common["Authorization"] = "Bearer " + token;
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
