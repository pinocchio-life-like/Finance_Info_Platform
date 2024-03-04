// useAuth.js
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      dispatch(login({ ...userData }));
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate, userData, dispatch]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      console.log(response.data.payload);
      setUserData({ ...response.data.payload });
      setIsLoggedIn(true);
    } catch (error) {
      setError("Failed to login. Please check your username and password.");
    }
  };

  const logout = async () => {
    authService.logout();
    setIsLoggedIn(false);
    // await dispatch(logout());
    navigate("/");
  };

  return { login, logout, error };
}

export default useAuth;
