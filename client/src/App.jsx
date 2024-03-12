import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import NavBar from "./components/Common/NavBar/NavBar";

function App() {
  return (
    <>
    <NavBar/>
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
