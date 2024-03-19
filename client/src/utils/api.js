import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-4wda.onrender.com",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const originalRequest = error.config;

      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== "/api/refreshToken"
      ) {
        originalRequest._retry = true;

        return api.post("/api/refreshToken").then((response) => {
          const newToken = response.data.token;
          console.log(newToken);
          api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return api(originalRequest);
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
