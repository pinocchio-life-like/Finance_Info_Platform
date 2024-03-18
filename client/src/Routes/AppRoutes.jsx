// AppRoutes.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import LoginPage from "../components/Login/LoginPage";
import DashboardPage from "../components/Dashboard/DashboardPage";
import ProfilePage from "../components/Profile/ProfilePage";
import Difference from "../components/DiffViewer/DiffViewer";
import Editor from "../components/Editor/Editor";
import Preview from "../components/Preview/Preview";
import RoleBasedRoute from "../components/RoleBasedRoute";
import WikiHome from "../components/Wiki/WikiHome";
import { useEffect } from "react";
import { authService } from "../services/authService";
import { Result } from "antd";
import NavBar from "../components/Common/NavBar/NavBar";
import History from "../components/History/History";

function AppRoutes() {
  const location = useLocation();
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!authService.isAuthenticated()) {
        await authService.refreshToken();
      }
    };

    checkTokenExpiration();
  }, []);

  return (
    <>
      {location.pathname !== "/login" && <NavBar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <>
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
            path="diffviewer"
            element={
              <PrivateRoute>
                <Difference />
              </PrivateRoute>
            }
          />
          <Route
            path="wiki/edit"
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
            path="wiki/history"
            element={
              <PrivateRoute>
                <WikiHome>
                  <History />
                </WikiHome>
              </PrivateRoute>
            }
          />
          <Route
            path="wiki/articles"
            element={
              <PrivateRoute>
                <WikiHome>
                  <Preview />
                </WikiHome>
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <Result
                style={{ marginTop: "12%" }}
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
              />
            }
          />
        </>
      </Routes>
    </>
  );
}

export default AppRoutes;
