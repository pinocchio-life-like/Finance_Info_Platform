import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import store from "../redux/store";
import {
  login as loginReducer,
  logout as logoutReducer,
} from "../redux/slices/userSlice";

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const data = response.data.payload;
      store.dispatch(
        loginReducer({
          userName: data.userName,
          firstName: data.firstName,
          userRole: data.userRole,
        })
      );
      setIsLoggedIn(true);
    } catch (error) {
      setError("Failed to login. Please check your username and password.");
    }
  };

  const logout = async () => {
    authService.logout();
    setIsLoggedIn(false);
    store.dispatch(logoutReducer());
    navigate("/");
  };

  return { login, logout, error };
}

export default useAuth;
