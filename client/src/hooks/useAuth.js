import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import store from "../redux/store";
import {
  login as loginReducer,
  logout as logoutReducer,
} from "../redux/slices/userSlice";

function useAuth() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const data = response.data.payload;
      console.log(data)
      store.dispatch(
        loginReducer({
          userName: data.userName,
          firstName: data.firstName,
          userRole: data.userRole,
        })
      );
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to login. Please check your username and password.");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      store.dispatch(logoutReducer());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return { login, logout, error };
}

export default useAuth;
