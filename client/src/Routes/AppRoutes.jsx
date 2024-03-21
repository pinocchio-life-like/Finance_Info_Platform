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
import { authService } from "../services/authService";
import { Result } from "antd";
import NavBar from "../components/Common/NavBar/NavBar";
import Admin from "../components/Dashboard/Admin/Admin";

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && <NavBar />}
      <Routes>
        <Route
          path="/login"
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
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
          path="diffviewer"
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
                <h1>History</h1>
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
