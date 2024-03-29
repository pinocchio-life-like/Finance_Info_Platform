import PrivateRoute from "../components/PrivateRoute";
import QandAHome from "../components/QandA/QandAHome";

export const QandARoutes = [
  {
    path: "qa",
    element: (
      <PrivateRoute>
        <QandAHome />
      </PrivateRoute>
    ),
  },
];
