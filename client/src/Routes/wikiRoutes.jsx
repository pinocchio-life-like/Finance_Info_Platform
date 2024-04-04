import Difference from "../components/Wiki/History/DiffViewer/DiffViewer";
import Editor from "../components/Wiki/Editor/Editor";
import Preview from "../components/Wiki/Preview/Preview";
import WikiHome from "../components/Wiki/WikiHome";
import History from "../components/Wiki/History/History";
import PrivateRoute from "../components/PrivateRoute";
import RoleBasedRoute from "../components/RoleBasedRoute";
import { Navigate } from "react-router-dom";
import WikiFiles from "../components/Wiki/WikiFiles/WikiFiles";

export const wikiRoutes = [
  {
    path: "/",
    element: <Navigate to={`/wiki/articles/${2}`} replace />,
  },
  {
    path: "dashboard",
    element: <Navigate to={`/wiki/articles/${2}`} replace />,
  },
  {
    path: "wiki/diffviewer/:category_Id/:id1/:id2",
    element: (
      <PrivateRoute>
        <Difference />
      </PrivateRoute>
    ),
  },
  {
    path: "wiki/edit/:id",
    element: (
      <RoleBasedRoute roles={["admin", "user"]}>
        <PrivateRoute>
          <WikiHome>
            <Editor />
          </WikiHome>
        </PrivateRoute>
      </RoleBasedRoute>
    ),
  },
  {
    path: "wiki/history/:id",
    element: (
      <PrivateRoute>
        <WikiHome>
          <History />
        </WikiHome>
      </PrivateRoute>
    ),
  },
  {
    path: "wiki/articles/:id",
    element: (
      <PrivateRoute>
        <WikiHome>
          <Preview />
        </WikiHome>
      </PrivateRoute>
    ),
  },
  {
    path: "wiki/files/:id",
    element: (
      <PrivateRoute>
        <WikiHome>
          <WikiFiles />
        </WikiHome>
      </PrivateRoute>
    ),
  },
];
