import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
const secretKey = import.meta.env.VITE_SECRET_KEY;
import { jwtDecode } from "jwt-decode";

const RoleBasedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token, secretKey);
  const { userRole } = decodedToken;
  return userRole === role ? children : <Navigate to="/404" replace />;
};

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string.isRequired,
};

export default RoleBasedRoute;
