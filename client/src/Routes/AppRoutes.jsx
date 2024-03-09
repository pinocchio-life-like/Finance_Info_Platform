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
import AdminUserAddForm from "../components/Adminpage/AdminUserAddForm";
import UserList from "../components/Adminpage/UserList";
import AdminPage from "../components/Adminpage/Adminpage";

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
          // <RoleBasedRoute role="admin">
        
              <Editor />
         
          // </RoleBasedRoute>
          
        }
      />
      <Route
        path="preview"
        element={
          // <PrivateRoute>
            <Preview />
          // </PrivateRoute>
        }
      />
      <Route path="/admin-add" element={<AdminUserAddForm/>}/>
      <Route path="/admin-user" element={<UserList/>}/>
      <Route path="/admin" element={<AdminPage/>}/>

      <Route path="404" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
