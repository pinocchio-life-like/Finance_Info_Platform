import PrivateRoute from "../components/PrivateRoute";
import AskQuestion from "../components/QandA/QandACommon/AskQuestion/AskQuestion";
import QandAHome from "../components/QandA/QandAHome";
import Questions from "../components/QandA/Questions/Questions";
import Tags from "../components/QandA/Tags/Tags";

export const QandARoutes = [
  {
    path: "qa/questions/:tag",
    element: (
      <PrivateRoute>
        <QandAHome>
          <Questions />
        </QandAHome>
      </PrivateRoute>
    ),
  },
  {
    path: "qa/tags",
    element: (
      <PrivateRoute>
        <QandAHome>
          <Tags />
        </QandAHome>
      </PrivateRoute>
    ),
  },
  {
    path: "/ask",
    element: (
      <PrivateRoute>
        <QandAHome>
          <AskQuestion />
        </QandAHome>
      </PrivateRoute>
    ),
  },
];
