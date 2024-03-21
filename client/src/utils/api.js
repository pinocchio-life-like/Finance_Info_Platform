import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
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
    } else {
      console.log("Network error", error);
    }

    return Promise.reject(error);
  }
);

export default api;