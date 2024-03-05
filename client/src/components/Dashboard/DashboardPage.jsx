import Logout from "../Login/logout";
import { useSelector } from "react-redux";

function DashboardPage() {
  const userRole = useSelector((state) => state.user);
  console.log(userRole);
  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Welcome to your dashboard!</p>
      <Logout />
    </div>
  );
}

export default DashboardPage;
