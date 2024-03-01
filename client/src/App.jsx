import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./components/Login/LoginPage";
import DashboardPage from "./components/Dashboard/DashboardPage";
import ProfilePage from "./components/Profile/ProfilePage";
import Difference from "./components/DiffViewer/DiffViewer";
import Editor from "./components/Editor/Editor";
import Preview from "./components/Preview/Preview";

function App() {
  return (
    <Router>
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
            <PrivateRoute>
              <Editor />
            </PrivateRoute>
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
      </Routes>
    </Router>
  );
}

export default App;
