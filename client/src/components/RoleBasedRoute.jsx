import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RoleBasedRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.userRole;
    } catch (error) {
      console.error("Invalid token");
    }
  }
  return roles.includes(userRole) ? children : <Navigate to="/404" replace />;
};

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleBasedRoute;
