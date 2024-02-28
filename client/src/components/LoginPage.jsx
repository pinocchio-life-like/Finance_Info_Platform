import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Replace these with the actual username and password from the form
    const username = "username";
    const password = "password";

    try {
      const response = await authService.login(username, password);
      console.log(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      setError("Failed to login. Please check your username and password.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" value="submit" />
      </form>
      {error && <p>{error}</p>}
    </>
  );
}

export default LoginPage;
