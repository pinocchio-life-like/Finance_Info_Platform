// useAuth.js
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

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
      console.log(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      setError("Failed to login. Please check your username and password.");
    }
  };

  return { login, error };
}

export default useAuth;
