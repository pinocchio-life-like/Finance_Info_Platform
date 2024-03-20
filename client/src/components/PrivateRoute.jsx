import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!authService.isAuthenticated()) {
        await authService.refreshToken();
      }
    };
    checkTokenExpiration();
  }, [navigate, children]);
  return authService.isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
