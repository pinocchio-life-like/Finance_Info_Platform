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

        console.log("Refresh token response:", response); // Log the refresh token response

        api.defaults.headers.common["Authorization"] = "Bearer " + token;
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return api(originalRequest);
      } catch (err) {
        console.log("Error refreshing token:", err); // Log the error if refreshing the token fails
        return Promise.reject(err);
      }
    }

    console.log("Error making request:", error); // Log the error if the request fails
    return Promise.reject(error);
  }
);

export default api;
