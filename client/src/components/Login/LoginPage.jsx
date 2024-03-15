// LoginPage.jsx
import LoginForm from "./LoginForm";
import useAuth from "../../hooks/useAuth";
import { Button, Flex } from 'antd';
import { Link } from "react-router-dom";

function LoginPage() {
  const { login, error } = useAuth();

  return (
    <>
    <div
      style={{ background: "linear-gradient(to right, #013E7A, #0057A6)" }}
      className="min-h-screen flex items-center justify-center">
      <LoginForm onSubmit={login} error={error} />
      
    </div>
   
   </>
  );
}

export default LoginPage;
