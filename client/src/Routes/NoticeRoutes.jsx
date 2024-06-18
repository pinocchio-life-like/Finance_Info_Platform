import NoticeHome from "../components/Notice/NoticeHome";
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
];
