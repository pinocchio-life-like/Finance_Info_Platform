import NoticeHome from "../components/Notice/NoticeHome";
import NoticeRead from "../components/Notice/Notices/NoticeRead";
import PrivateRoute from "../components/PrivateRoute";

export const NoticeRoutes = [
  {
    path: "notice",
    element: (
      <PrivateRoute>
        <NoticeHome />
      </PrivateRoute>
    ),
  },
  {
    path: "notice/:id",
    element: (
      <PrivateRoute>
        <NoticeRead />
      </PrivateRoute>
    ),
  },
];
