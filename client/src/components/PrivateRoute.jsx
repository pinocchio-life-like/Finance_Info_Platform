import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (authService.isAuthenticated()) {
        try {
          await authService.refreshToken();
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
      setIsAuthenticated(authService.isAuthenticated());
    };

    checkTokenExpiration();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
