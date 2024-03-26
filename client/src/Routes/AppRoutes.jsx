// AppRoutes.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import LoginPage from "../components/Login/LoginPage";
import DashboardPage from "../components/Dashboard/DashboardPage";
import ProfilePage from "../components/Profile/ProfilePage";
import Difference from "../components/DiffViewer/DiffViewer";
import Editor from "../components/Wiki/Editor/Editor";
import Preview from "../components/Wiki/Preview/Preview";
import RoleBasedRoute from "../components/RoleBasedRoute";
import WikiHome from "../components/Wiki/WikiHome";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { Result } from "antd";
import NavBar from "../components/Common/NavBar/NavBar";
import Admin from "../components/Dashboard/Admin/Admin";
import { useNavigate } from "react-router-dom";
import History from "../components/Wiki/History/History";

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
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
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
        <Route
          path="wiki/diffviewer/:category_Id/:id1/:id2"
          element={
            <PrivateRoute>
              <Difference />
            </PrivateRoute>
          }
        />
        <Route
          path="wiki/edit/:id"
          element={
            <RoleBasedRoute role="admin">
              <PrivateRoute>
                <WikiHome>
                  <Editor />
                </WikiHome>
              </PrivateRoute>
            </RoleBasedRoute>
          }
        />
        <Route
          path="wiki/history/:id"
          element={
            <PrivateRoute>
              <WikiHome>
                <History/>
              </WikiHome>
            </PrivateRoute>
          }
        />
        <Route
          path="wiki/articles/:id"
          element={
            <PrivateRoute>
              <WikiHome>
                <Preview />
              </WikiHome>
            </PrivateRoute>
          }
        />
        <Route
          path="manage"
          element={
            <RoleBasedRoute role="admin">
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
