import PrivateRoute from "../components/PrivateRoute";
import AskQuestion from "../components/QandA/QandACommon/AskQuestion/AskQuestion";
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
  {
    path: "/ask",
    element: (
      <PrivateRoute>
        <QandAHome>
          <AskQuestion/>
        </QandAHome>
      </PrivateRoute>
    ),
  },
];
