// useAuth.js
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  login as loginReducer,
  logout as logoutReducer,
} from "../redux/slices/userSlice";

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      console.log(response.data.payload);
      const data = response.data.payload;
      dispatch(loginReducer({ ...data }));
      setIsLoggedIn(true);
    } catch (error) {
      setError("Failed to login. Please check your username and password.");
    }
  };

  const logout = async () => {
    authService.logout();
    setIsLoggedIn(false);
    dispatch(logoutReducer());
    navigate("/");
  };

  return { login, logout, error };
}

export default useAuth;
