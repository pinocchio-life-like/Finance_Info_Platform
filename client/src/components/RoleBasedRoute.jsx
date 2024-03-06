import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, role }) => {
  const userRole = useSelector((state) => state.user.userRole);

  return userRole === role ? children : <Navigate to="/404" replace />;
};

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string.isRequired,
};

export default RoleBasedRoute;
