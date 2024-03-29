import PrivateRoute from "../components/PrivateRoute";
import QandAHome from "../components/QandA/QandAHome";
import Questions from "../components/QandA/Questions/Questions";

export const QandARoutes = [
  {
    path: "qa/questions",
    element: (
      <PrivateRoute>
        <QandAHome>
          <Questions />
        </QandAHome>
      </PrivateRoute>
    ),
  },
];
