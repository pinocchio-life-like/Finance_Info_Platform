import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div
      style={{ background: "linear-gradient(to right, #013E7A, #0057A6)" }}
      className="min-h-screen flex items-center justify-center">
      <form
        style={{ width: "450px", height: "470px" }}
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center">
        <img
          style={{ width: "80px", height: "68px" }}
          src={logo}
          alt="Description"
          className="mt-4"
        />
        <h2 style={{ color: "#241F1F" }} className="text-2xl mt-5 font-sans">
          LOGIN
        </h2>
        <p className="text-sm mt-2">Please Enter Your Username and Password!</p>
        <div className="relative mt-10 mb-4 w-full">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative mb-6 w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="shadow appearance-none border rounded w-full py-3 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {showPassword ? (
            <FaEye
              onClick={() => setShowPassword(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          ) : (
            <FaEyeSlash
              onClick={() => setShowPassword(true)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          )}
        </div>
        <div className="mb-6 w-full">
          <input
            style={{
              background: "linear-gradient(to right, #013E7A, #0057A6)",
            }}
            type="submit"
            value="submit"
            className=" text-white font-bold py-3 px-4 w-full rounded focus:outline-none focus:shadow-outline"
          />
        </div>
      </form>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
}

export default LoginPage;
