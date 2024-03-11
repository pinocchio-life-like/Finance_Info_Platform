// AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
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
import AdminUserAddForm from "../components/Adminpage/AdminUserAddForm";
import UserList from "../components/Adminpage/UserList";
import AdminPage from "../components/Adminpage/Adminpage";

function AppRoutes() {
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!authService.isAuthenticated()) {
        await authService.refreshToken();
      }
    };

    checkTokenExpiration();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
          // <PrivateRoute>
          <DashboardPage />
          // </PrivateRoute>
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
          // <RoleBasedRoute role="admin">
          // <PrivateRoute>
          <WikiHome>
            <Editor />
          </WikiHome>
          //{/* </PrivateRoute> */}
          // </RoleBasedRoute>
        }
      />
      <Route
        path="wiki/history"
        element={
          <PrivateRoute>
            <WikiHome>
              <h1>History</h1>
            </WikiHome>
          </PrivateRoute>
        }
      />
      <Route
        path="wiki/articles"
        element={
          // <PrivateRoute>
          <WikiHome>
            <Preview />
          </WikiHome>
          /* </PrivateRoute> */
        }
      />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
