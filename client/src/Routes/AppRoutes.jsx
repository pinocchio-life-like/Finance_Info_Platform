// AppRoutes.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import LoginPage from "../components/Login/LoginPage";
// import DashboardPage from "../components/Dashboard/DashboardPage";
import ProfilePage from "../components/Profile/ProfilePage";
import RoleBasedRoute from "../components/RoleBasedRoute";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { Result } from "antd";
import NavBar from "../components/Common/NavBar/NavBar";
import Admin from "../components/Dashboard/Admin/Admin";
import { useNavigate } from "react-router-dom";
import { wikiRoutes } from "./wikiRoutes";
import { QandARoutes } from "./QandARoutes";
import { FTPRoutes } from "./FileTransferRoutes";
import { NoticeRoutes } from "./NoticeRoutes";

function AppRoutes() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!authService.isAuthenticated()) {
        try {
          await authService.refreshToken();
        } catch (error) {
          console.error("Error refreshing token:", error);
          navigate("/login", { replace: true });
        }
      }
      setIsAuthenticated(authService.isAuthenticated());
    };

    checkTokenExpiration();
  }, [navigate]);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <>
      {location.pathname !== "/login" && <NavBar />}
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {wikiRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        {QandARoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        {FTPRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        {NoticeRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        <Route
          path="manage"
          element={
            <RoleBasedRoute roles={["admin"]}>
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            </RoleBasedRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <Result
                style={{ marginTop: "12%" }}
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
              />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
