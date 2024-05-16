import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import store from "../redux/store";
import { persistStore } from "redux-persist";
import api from "../utils/api";

function useAuth() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const login = async (credentials) => {
    try {
      await authService.login(credentials);
      const firstArticle = await api.get("/api/articles/first");
      if (firstArticle.data.data) {
        navigate(`/wiki/articles/${firstArticle.data.data}`);
      } else {
        navigate(`/wiki/articles/2`);
      }
    } catch (error) {
      setError("Failed to login. Please check your username and password.");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      const persistor = persistStore(store);
      await persistor.purge();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return { login, logout, error };
}

export default useAuth;
