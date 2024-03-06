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

function AppRoutes() {
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
        path="editor"
        element={
          <RoleBasedRoute role="admin">
            <PrivateRoute>
              <Editor />
            </PrivateRoute>
          </RoleBasedRoute>
        }
      />
      <Route
        path="preview"
        element={
          <PrivateRoute>
            <Preview />
          </PrivateRoute>
        }
      />
      <Route path="404" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
