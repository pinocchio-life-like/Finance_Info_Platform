import useAuth from "../../hooks/useAuth";
function Logout() {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
}

export default Logout;
