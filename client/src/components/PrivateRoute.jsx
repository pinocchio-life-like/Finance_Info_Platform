import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export default PrivateRoute;
